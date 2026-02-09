from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


# --- User Schemas ---

class UserRole(str, Enum):
    EDITOR = "editor"
    ADMIN = "admin"
    CREATOR = "creator"


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    whop_email: Optional[str] = None
    instagram_username: Optional[str] = None
    tiktok_username: Optional[str] = None
    youtube_channel: Optional[str] = None
    twitter_username: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: str
    avatar_url: Optional[str] = None
    whop_email: Optional[str] = None
    instagram_username: Optional[str] = None
    tiktok_username: Optional[str] = None
    youtube_channel: Optional[str] = None
    twitter_username: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None


# --- Campaign Schemas ---

class CampaignBase(BaseModel):
    title: str
    description: Optional[str] = None
    creator_name: Optional[str] = None
    category: Optional[str] = None
    payout_type: Optional[str] = "per_view"
    payout_rate: Optional[float] = 0.5
    min_payout: Optional[float] = 10.0
    max_payout: Optional[float] = 500.0
    total_budget: Optional[float] = 10000.0
    platform: Optional[str] = "youtube"
    requirements: Optional[str] = None
    image_url: Optional[str] = None


class CampaignCreate(CampaignBase):
    pass


class CampaignResponse(CampaignBase):
    id: int
    used_budget: float
    is_active: bool
    created_at: datetime
    deadline: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# --- Submission Schemas ---

class SubmissionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class SubmissionCreate(BaseModel):
    campaign_id: int
    video_url: str
    title: Optional[str] = None


class SubmissionResponse(BaseModel):
    id: int
    user_id: int
    campaign_id: int
    video_url: str
    title: Optional[str] = None
    views: int
    earnings: float
    status: str
    rejection_reason: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class SubmissionReview(BaseModel):
    status: SubmissionStatus
    rejection_reason: Optional[str] = None


# --- Chat Schemas ---

class ChatMessageCreate(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatMessageResponse(BaseModel):
    id: int
    message: str
    is_bot: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class ChatBotResponse(BaseModel):
    user_message: ChatMessageResponse
    bot_message: ChatMessageResponse
