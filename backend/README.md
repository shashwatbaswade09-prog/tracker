# Nexus Backend API

A FastAPI backend for the Nexus creator monetization platform.

## 🚀 Quick Start

### 1. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the server
```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Open API docs
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📁 Project Structure

```
nexusbackend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── api/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── campaigns.py     # Campaign CRUD endpoints
│   │   └── chatbot.py       # Chatbot API
│   ├── config/
│   │   └── settings.py      # App configuration
│   ├── db/
│   │   ├── database.py      # Database connection
│   │   └── models.py        # SQLAlchemy models
│   ├── schemas/
│   │   └── schemas.py       # Pydantic schemas
│   └── services/
│       └── auth_service.py  # Authentication logic
├── requirements.txt
├── .env.example
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login (returns JWT)
- `GET /api/v1/auth/me` - Get current user
- `PATCH /api/v1/auth/me` - Update profile

### Campaigns
- `GET /api/v1/campaigns` - List all campaigns
- `GET /api/v1/campaigns/{id}` - Get campaign details
- `POST /api/v1/campaigns` - Create campaign (admin)
- `POST /api/v1/campaigns/{id}/submit` - Submit to campaign
- `GET /api/v1/campaigns/my/submissions` - My submissions

### Chatbot
- `POST /api/v1/chat/message` - Send message to bot
- `GET /api/v1/chat/history/{session_id}` - Get chat history

## 🔒 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
SECRET_KEY=your-super-secret-key-here
OPENAI_API_KEY=sk-xxx  # Optional, for AI chatbot
```

## 🗄️ Database

SQLite is used by default (great for development). The database file `nexus.db` is created automatically on first run.

For production, update `DATABASE_URL` in settings to use PostgreSQL:
```
DATABASE_URL=postgresql://user:password@host:5432/nexus
```
