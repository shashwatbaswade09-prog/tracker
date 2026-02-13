from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config.settings import get_settings
from app.db.database import init_db
from app.api import auth, campaigns, chatbot, support

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup"""
    init_db()
    
    # Seed some demo data
    from app.db.database import SessionLocal
    from app.db.models import Campaign
    
    db = SessionLocal()
    try:
        # Check if we need to seed campaigns
        if db.query(Campaign).count() == 0:
            demo_campaigns = [
                Campaign(
                    title="ThinkSchool's Podcast - $0.50 per 1K views",
                    description="Create engaging clips from ThinkSchool podcast episodes",
                    creator_name="ThinkSchool",
                    category="Personal brand",
                    payout_type="per_view",
                    payout_rate=0.50,
                    min_payout=20.0,
                    max_payout=200.0,
                    total_budget=10000.0,
                    platform="instagram",
                    requirements='["Audio clips with speakers in highlights", "Include branding as shown in reference", "30-60 seconds duration"]',
                    image_url="https://images.unsplash.com/photo-1593344484962-996055d493b4?q=80&w=1200"
                ),
                Campaign(
                    title="Summer Gaming Vibe - $0.50 per 1K Views",
                    description="Create viral gaming clips for our community",
                    creator_name="Nexus Gaming Hub",
                    category="Gaming",
                    payout_type="per_view",
                    payout_rate=0.50,
                    min_payout=10.0,
                    max_payout=500.0,
                    total_budget=50000.0,
                    platform="youtube",
                    requirements='["Minimum 15 seconds", "Include Nexus logo", "No copyrighted music", "Original edits only"]',
                    image_url="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200"
                ),
                Campaign(
                    title="Aesthetic Edits 2024 - $8.50 per Approved Clip",
                    description="Create beautiful aesthetic content for Instagram",
                    creator_name="Vibe Central",
                    category="Lifestyle",
                    payout_type="per_clip",
                    payout_rate=8.50,
                    min_payout=8.50,
                    max_payout=255.0,
                    total_budget=25000.0,
                    platform="instagram",
                    requirements='["Portrait mode 9:16 only", "High-quality color grading", "Max 3 clips per day"]',
                    image_url="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"
                ),
            ]
            for campaign in demo_campaigns:
                db.add(campaign)
            db.commit()
            print("✅ Seeded demo campaigns")
    finally:
        db.close()
    
    yield


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Nexus - Creator Monetization Platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(campaigns.router, prefix=settings.API_V1_PREFIX)
app.include_router(chatbot.router, prefix=settings.API_V1_PREFIX)
app.include_router(support.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check for deployment"""
    return {"status": "healthy"}
