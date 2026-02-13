# Nexus - Social Media Campaign Platform 🚀

A comprehensive platform for managing social media campaigns across Instagram, YouTube, and TikTok, with automated analytics tracking and creator management.

## 📁 Project Structure

```text
nexus/
├── NEXUS_TRY/NEXUSfrontend/  # React + Vite + TypeScript Frontend
├── apps/                      # Django Backend Apps
│   ├── core/                  # Auth, Users, Config
│   ├── campaigns/             # Campaign management
│   ├── submissions/           # Link submissions & Analytics
│   └── integrations/          # Connected social accounts
├── config/                    # Django settings
└── docker-compose.yml         # Docker orchestration
```

---

## 🛠️ Quick Start with Docker

### Prerequisites
- **Docker** and **Docker Compose**
- **Git**

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/shashwatbaswade09-prog/NEXUS_TRY.git
   cd nexus
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start with Docker**
   ```bash
   docker-compose up --build
   ```

4. **Run Migrations & Seed Data**
   ```bash
   docker-compose exec web python manage.py migrate
   docker-compose exec web python manage.py seed
   ```

5. **Access the Application**
   - **API Root**: `http://localhost:8000/api/`
   - **Admin Panel**: `http://localhost:8000/admin/` (User: `admin`, Pass: `admin`)
   - **Swagger Docs**: `http://localhost:8000/api/docs/`
   - **Frontend**: `http://localhost:5173`

---

## 🚀 Features

### Backend (Django + DRF)
- **Authentication**: JWT-based auth with role management (Admin/Brand/Clipper)
- **Campaign Management**: Create and manage social media campaigns
- **Social Integration**: Connect Instagram, YouTube, and TikTok accounts
- **Analytics Tracking**: Automated view tracking via Celery workers
- **Manual Verification**: Support for manual account verification

### Frontend (React + TypeScript)
- **Modern UI**: Glassmorphism design with responsive layouts
- **Dashboard Views**: Separate dashboards for Admin, Brand, and Clipper roles
- **Campaign Discovery**: Browse and join available campaigns
- **Earnings Tracking**: Real-time earnings and submission tracking
- **AI Chatbot**: Intelligent media orchestration assistant

---

## 📱 Core Apps

### Core
- User authentication and authorization
- Role-based access control (Admin, Brand, Clipper)
- OTP verification system

### Campaigns
- Campaign creation and management
- Budget tracking (CPM-based)
- Creator group management
- Campaign image uploads

### Submissions
- Link submission system
- Multi-platform analytics providers (YouTube, Instagram, TikTok)
- Automated view tracking via Celery
- Status tracking (pending, approved, rejected)

### Integrations
- Connected social account management
- Manual and automated verification
- Platform-specific authentication flows
- Access token management

---

## 🔄 API Usage Flow

### For Clippers (Content Creators)

1. **Register & Login**
   ```bash
   POST /api/auth/register/
   POST /api/auth/login/
   ```

2. **View Available Campaigns**
   ```bash
   GET /api/campaigns/
   ```

3. **Join a Campaign**
   ```bash
   POST /api/campaigns/{id}/join/
   ```

4. **Connect Social Account**
   ```bash
   POST /api/integrations/connected-accounts/
   # Platform options: INSTAGRAM, YOUTUBE, TIKTOK
   ```

5. **Submit Content Link**
   ```bash
   POST /api/submissions/
   ```

6. **View Dashboard & Earnings**
   ```bash
   GET /api/dashboard/clipper/
   ```

---

## ⚙️ Background Workers

The platform uses **Celery** for background task processing:

- **Analytics Fetching**: Automated view count updates
- **Scheduled Tasks**: Periodic analytics refresh
- **Task Queue**: Redis-backed task management

---

## 🧪 Development

### Local Development (Without Docker)

#### Backend
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed data
python manage.py seed

# Run development server
python manage.py runserver
```

#### Frontend
```bash
cd NEXUS_TRY/NEXUSfrontend

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 📧 Email Support System

The platform includes automated email notifications using Gmail SMTP:

1. Enable **2-Step Verification** on your Google Account
2. Create an **App Password** at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Add credentials to `.env`:
   ```
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

---

## 🔐 Security Notes

- Never commit `.env` files (already in `.gitignore`)
- Use strong passwords for production
- Rotate API keys and tokens regularly
- Keep dependencies updated

---

## 📚 Documentation

- **OAuth Setup**: See `docs/OAUTH_SETUP.md` for social platform integration
- **API Documentation**: Available at `/api/docs/` when running
- **Admin Guide**: Access admin panel for user and campaign management

---

## 🛠️ Tech Stack

**Backend:**
- Django 4.x
- Django REST Framework
- Celery + Redis
- PostgreSQL (production) / SQLite (development)
- Docker

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

---

## 👨‍💻 Developed by

**Shashwat Baswade**

---

## 📝 License

This project is proprietary software. All rights reserved.
