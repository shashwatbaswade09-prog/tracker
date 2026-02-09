from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum


class UserRole(str, enum.Enum):
    EDITOR = "editor"
    ADMIN = "admin"
    CREATOR = "creator"


class SubmissionStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(20), default=UserRole.EDITOR)
    avatar_url = Column(String(500))
    whop_email = Column(String(255))
    
    # Social connections
    instagram_username = Column(String(100))
    tiktok_username = Column(String(100))
    youtube_channel = Column(String(100))
    twitter_username = Column(String(100))
    
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    submissions = relationship("Submission", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")


class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    creator_name = Column(String(255))
    category = Column(String(100))
    
    # Payout settings
    payout_type = Column(String(50))  # "per_view", "per_clip", "per_lead"
    payout_rate = Column(Float, default=0.5)  # e.g., $0.50 per 1K views
    min_payout = Column(Float, default=10.0)
    max_payout = Column(Float, default=500.0)
    
    # Budget
    total_budget = Column(Float, default=10000.0)
    used_budget = Column(Float, default=0.0)
    
    # Platform
    platform = Column(String(50))  # youtube, instagram, tiktok, twitter
    
    # Requirements
    requirements = Column(Text)  # JSON string of requirements
    
    # Status
    is_active = Column(Boolean, default=True)
    deadline = Column(DateTime(timezone=True))
    
    image_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    submissions = relationship("Submission", back_populates="campaign")


class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    
    video_url = Column(String(500), nullable=False)
    title = Column(String(255))
    
    # Stats
    views = Column(Integer, default=0)
    earnings = Column(Float, default=0.0)
    
    # Status
    status = Column(String(20), default=SubmissionStatus.PENDING)
    rejection_reason = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="submissions")
    campaign = relationship("Campaign", back_populates="submissions")


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(100), index=True)  # For anonymous users
    
    message = Column(Text, nullable=False)
    is_bot = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="chat_messages")


class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class SupportTicket(Base):
    __tablename__ = "support_tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # User info (can be anonymous)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(100), index=True)
    user_email = Column(String(255), nullable=False)
    user_name = Column(String(255), default="Guest")
    
    # Ticket content
    subject = Column(String(255), default="Support Request")
    initial_message = Column(Text, nullable=False)
    
    # Status and priority
    status = Column(String(20), default=TicketStatus.OPEN)
    priority = Column(String(20), default=TicketPriority.MEDIUM)
    
    # Assignment
    assigned_to = Column(String(255))  # Support agent email/name
    
    # Email tracking
    email_sent = Column(Boolean, default=False)
    confirmation_sent = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True))
    
    # Relationships
    messages = relationship("TicketMessage", back_populates="ticket")


class TicketMessage(Base):
    """Messages within a support ticket thread"""
    __tablename__ = "ticket_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("support_tickets.id"), nullable=False)
    
    sender_email = Column(String(255), nullable=False)
    sender_name = Column(String(255))
    message = Column(Text, nullable=False)
    is_from_support = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    ticket = relationship("SupportTicket", back_populates="messages")

