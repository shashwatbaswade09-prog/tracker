from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from app.db.database import get_db
from app.db.models import ChatMessage, User
from app.schemas.schemas import ChatMessageCreate, ChatMessageResponse, ChatBotResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/chat", tags=["Chatbot"])

# Simple rule-based responses (can be upgraded to AI later)
BOT_RESPONSES = {
    "pricing": "We offer flexible pricing plans starting at $9/month. Our Pro plan at $29/month includes unlimited access to all features. Would you like me to explain each plan in detail?",
    "how": "It's simple! 1️⃣ Sign up for an account, 2️⃣ Connect your platforms, 3️⃣ Start managing everything from one dashboard. Want me to walk you through the setup?",
    "support": "I'll connect you with our support team right away! 🙋‍♂️ Please hold while I transfer you to a human agent. Average wait time: 2 minutes.",
    "features": "Here are our top features:\n✨ Real-time analytics\n🔗 Multi-platform integration\n🤖 AI-powered automation\n📊 Custom dashboards\n🔒 Enterprise-grade security\n\nWould you like details on any specific feature?",
    "campaign": "To find campaigns, go to the 'Discover' section. You can filter by platform, category, and payout rate. Once you find a campaign you like, click on it to see the requirements and submit your content!",
    "payment": "Payments are processed weekly via your connected Whop email. Minimum payout threshold is $20. Make sure your Whop email is verified in your profile settings!",
    "submit": "To submit content: 1️⃣ Go to the campaign page, 2️⃣ Click 'Submit', 3️⃣ Paste your video URL, 4️⃣ Wait for review. Approvals typically take 24-48 hours.",
    "hello": "Hey there! 👋 I'm your Nexus assistant. How can I help you today? You can ask me about campaigns, pricing, submissions, or anything else!",
    "hi": "Hey there! 👋 I'm your Nexus assistant. How can I help you today? You can ask me about campaigns, pricing, submissions, or anything else!",
}

DEFAULT_RESPONSE = "Thanks for your message! I'm here to help. You can ask me about:\n\n📢 Campaigns & submissions\n💰 Pricing & payments\n🔧 Features & setup\n👥 Support\n\nOr I can connect you with our support team! 💬"


def get_bot_response(message: str) -> str:
    """Get a bot response based on keywords in the message"""
    message_lower = message.lower()
    
    for keyword, response in BOT_RESPONSES.items():
        if keyword in message_lower:
            return response
    
    return DEFAULT_RESPONSE


@router.post("/message", response_model=ChatBotResponse)
async def send_message(
    chat_data: ChatMessageCreate,
    db: Session = Depends(get_db)
):
    """Send a message to the chatbot and get a response (anonymous)"""
    # Generate session ID if not provided
    session_id = chat_data.session_id or str(uuid.uuid4())
    
    # Save user message
    user_message = ChatMessage(
        user_id=None,
        session_id=session_id,
        message=chat_data.message,
        is_bot=False
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    
    # Generate bot response
    bot_response_text = get_bot_response(chat_data.message)
    
    # Save bot message
    bot_message = ChatMessage(
        user_id=None,
        session_id=session_id,
        message=bot_response_text,
        is_bot=True
    )
    db.add(bot_message)
    db.commit()
    db.refresh(bot_message)
    
    return ChatBotResponse(
        user_message=ChatMessageResponse(
            id=user_message.id,
            message=user_message.message,
            is_bot=False,
            created_at=user_message.created_at
        ),
        bot_message=ChatMessageResponse(
            id=bot_message.id,
            message=bot_message.message,
            is_bot=True,
            created_at=bot_message.created_at
        )
    )


@router.get("/history/{session_id}", response_model=list[ChatMessageResponse])
async def get_chat_history(
    session_id: str,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get chat history for a session"""
    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).limit(limit).all()
    
    return messages


@router.post("/message/authenticated", response_model=ChatBotResponse)
async def send_message_authenticated(
    chat_data: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message to the chatbot (authenticated users)"""
    session_id = chat_data.session_id or f"user_{current_user.id}"
    
    # Save user message
    user_message = ChatMessage(
        user_id=current_user.id,
        session_id=session_id,
        message=chat_data.message,
        is_bot=False
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    
    # Generate bot response
    bot_response_text = get_bot_response(chat_data.message)
    
    # Save bot message
    bot_message = ChatMessage(
        user_id=None,
        session_id=session_id,
        message=bot_response_text,
        is_bot=True
    )
    db.add(bot_message)
    db.commit()
    db.refresh(bot_message)
    
    return ChatBotResponse(
        user_message=ChatMessageResponse(
            id=user_message.id,
            message=user_message.message,
            is_bot=False,
            created_at=user_message.created_at
        ),
        bot_message=ChatMessageResponse(
            id=bot_message.id,
            message=bot_message.message,
            is_bot=True,
            created_at=bot_message.created_at
        )
    )
