from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.database import get_db
from app.db.models import Campaign, Submission, User
from app.schemas.schemas import (
    CampaignCreate, CampaignResponse,
    SubmissionCreate, SubmissionResponse, SubmissionReview
)
from app.services.auth_service import get_current_user, get_current_admin_user

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


# --- Campaign Endpoints ---

@router.get("/", response_model=List[CampaignResponse])
async def get_campaigns(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    platform: Optional[str] = None,
    category: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all campaigns with optional filters"""
    query = db.query(Campaign)
    
    if active_only:
        query = query.filter(Campaign.is_active == True)
    if platform:
        query = query.filter(Campaign.platform == platform)
    if category:
        query = query.filter(Campaign.category == category)
    
    campaigns = query.offset(skip).limit(limit).all()
    return campaigns


@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    """Get a specific campaign by ID"""
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    return campaign


@router.post("/", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    campaign_data: CampaignCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new campaign (admin only)"""
    db_campaign = Campaign(**campaign_data.model_dump())
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign


@router.patch("/{campaign_id}", response_model=CampaignResponse)
async def update_campaign(
    campaign_id: int,
    campaign_data: CampaignCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a campaign (admin only)"""
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    update_data = campaign_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(campaign, field, value)
    
    db.commit()
    db.refresh(campaign)
    return campaign


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a campaign (admin only)"""
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    db.delete(campaign)
    db.commit()


# --- Submission Endpoints ---

@router.post("/{campaign_id}/submit", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_to_campaign(
    campaign_id: int,
    submission_data: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a video to a campaign"""
    # Check campaign exists and is active
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    if not campaign.is_active:
        raise HTTPException(status_code=400, detail="Campaign is not active")
    
    # Check budget
    if campaign.used_budget >= campaign.total_budget:
        raise HTTPException(status_code=400, detail="Campaign budget exhausted")
    
    # Create submission
    db_submission = Submission(
        user_id=current_user.id,
        campaign_id=campaign_id,
        video_url=submission_data.video_url,
        title=submission_data.title
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission


@router.get("/{campaign_id}/submissions", response_model=List[SubmissionResponse])
async def get_campaign_submissions(
    campaign_id: int,
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get submissions for a campaign (user sees own, admin sees all)"""
    query = db.query(Submission).filter(Submission.campaign_id == campaign_id)
    
    # Non-admins only see their own submissions
    if current_user.role != "admin":
        query = query.filter(Submission.user_id == current_user.id)
    
    if status_filter:
        query = query.filter(Submission.status == status_filter)
    
    return query.all()


@router.get("/my/submissions", response_model=List[SubmissionResponse])
async def get_my_submissions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all submissions for current user"""
    submissions = db.query(Submission).filter(
        Submission.user_id == current_user.id
    ).order_by(Submission.created_at.desc()).all()
    return submissions


@router.patch("/submissions/{submission_id}/review", response_model=SubmissionResponse)
async def review_submission(
    submission_id: int,
    review: SubmissionReview,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Review a submission (admin only)"""
    from datetime import datetime, timezone
    
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    submission.status = review.status
    submission.rejection_reason = review.rejection_reason
    submission.reviewed_at = datetime.now(timezone.utc)
    
    # If approved, calculate earnings (simplified)
    if review.status == "approved":
        campaign = db.query(Campaign).filter(Campaign.id == submission.campaign_id).first()
        if campaign:
            # Example: $0.50 per 1K views, assume 10K views for demo
            estimated_views = 10000
            submission.views = estimated_views
            submission.earnings = (estimated_views / 1000) * campaign.payout_rate
            campaign.used_budget += submission.earnings
    
    db.commit()
    db.refresh(submission)
    return submission
