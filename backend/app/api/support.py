from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timezone

from app.db.database import get_db
from app.db.models import SupportTicket, TicketMessage
from app.services.email_service import email_service
from app.services.auth_service import get_current_user
from app.db.models import User

router = APIRouter(prefix="/support", tags=["Support"])


# --- Schemas ---

class CreateTicketRequest(BaseModel):
    email: EmailStr
    name: str = "Guest"
    message: str
    subject: Optional[str] = "Support Request"
    session_id: Optional[str] = None


class TicketMessageCreate(BaseModel):
    message: str
    is_from_support: bool = False


class TicketMessageResponse(BaseModel):
    id: int
    sender_email: str
    sender_name: Optional[str]
    message: str
    is_from_support: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TicketResponse(BaseModel):
    id: int
    user_email: str
    user_name: str
    subject: str
    initial_message: str
    status: str
    priority: str
    assigned_to: Optional[str]
    email_sent: bool
    created_at: datetime
    resolved_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class TicketDetailResponse(TicketResponse):
    messages: List[TicketMessageResponse] = []


# --- Endpoints ---

@router.post("/ticket", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_support_ticket(
    ticket_data: CreateTicketRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new support ticket and send email notifications"""
    
    # Create the ticket
    ticket = SupportTicket(
        user_email=ticket_data.email,
        user_name=ticket_data.name,
        subject=ticket_data.subject,
        initial_message=ticket_data.message,
        session_id=ticket_data.session_id,
        status="open",
        priority="medium"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    
    # Send emails in background (non-blocking)
    background_tasks.add_task(
        send_ticket_emails,
        ticket_id=ticket.id,
        user_email=ticket.user_email,
        user_name=ticket.user_name,
        message=ticket.initial_message,
        session_id=ticket.session_id or "anonymous",
        db=db
    )
    
    return ticket


def send_ticket_emails(
    ticket_id: int,
    user_email: str,
    user_name: str,
    message: str,
    session_id: str,
    db: Session
):
    """Background task to send email notifications"""
    try:
        # Send notification to support team
        support_sent = email_service.send_support_ticket_notification(
            ticket_id=ticket_id,
            user_email=user_email,
            user_name=user_name,
            message=message,
            session_id=session_id
        )
        
        # Send confirmation to user
        confirmation_sent = email_service.send_ticket_confirmation(
            ticket_id=ticket_id,
            user_email=user_email,
            user_name=user_name
        )
        
        # Update ticket with email status
        ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
        if ticket:
            ticket.email_sent = support_sent
            ticket.confirmation_sent = confirmation_sent
            db.commit()
            
    except Exception as e:
        print(f"Error sending ticket emails: {e}")


@router.get("/ticket/{ticket_id}", response_model=TicketDetailResponse)
async def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):
    """Get a support ticket with all messages"""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.post("/ticket/{ticket_id}/message", response_model=TicketMessageResponse)
async def add_ticket_message(
    ticket_id: int,
    message_data: TicketMessageCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Add a message to an existing ticket"""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Determine sender info
    if message_data.is_from_support:
        sender_email = email_service.support_email or "support@nexus.com"
        sender_name = "Nexus Support"
    else:
        sender_email = ticket.user_email
        sender_name = ticket.user_name
    
    # Create message
    ticket_message = TicketMessage(
        ticket_id=ticket_id,
        sender_email=sender_email,
        sender_name=sender_name,
        message=message_data.message,
        is_from_support=message_data.is_from_support
    )
    db.add(ticket_message)
    
    # Update ticket status
    if message_data.is_from_support and ticket.status == "open":
        ticket.status = "in_progress"
    
    db.commit()
    db.refresh(ticket_message)
    
    return ticket_message


@router.patch("/ticket/{ticket_id}/status")
async def update_ticket_status(
    ticket_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update ticket status (admin/support only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    valid_statuses = ["open", "in_progress", "resolved", "closed"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    ticket.status = status
    if status in ["resolved", "closed"]:
        ticket.resolved_at = datetime.now(timezone.utc)
    
    db.commit()
    return {"message": f"Ticket #{ticket_id} status updated to {status}"}


@router.get("/tickets", response_model=List[TicketResponse])
async def list_tickets(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all support tickets (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = db.query(SupportTicket).order_by(SupportTicket.created_at.desc())
    
    if status_filter:
        query = query.filter(SupportTicket.status == status_filter)
    
    return query.all()
