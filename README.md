# Nexus Media Orchestration (V1.0) 🚀

Welcome to the **Nexus Media** monorepo! This repository contains both the Frontend (React) and Backend (FastAPI) components of the platform.

## 📁 Project Structure

```text
nexusapptry/
├── frontend/  # React + Vite + Tailwind CSS
└── backend/   # FastAPI + SQLAlchemy + SMTP Email
```

---

## 🛠️ How to Run Locally

Follow these steps to get the full application running on your machine.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Git**

### 2. Backend Setup
```bash
# Go to backend folder
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup Environment Variables
# Copy the example file and fill in your credentials
cp .env.example .env

# Run the server
uvicorn app.main:app --reload --port 8000
```
*The API will be live at `http://localhost:8000`*

### 3. Frontend Setup
```bash
# Open a new terminal window and go to frontend folder
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
*The website will be live at `http://localhost:5173`*

---

## 📧 Support System Setup
The automated email support system uses Gmail SMTP. To enable it:
1. Enable **2-Step Verification** on your Google Account.
2. Create an **App Password** at: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Add your email and app password to `backend/.env`.

---

## 🚀 Features
- **AI Chatbot**: Intelligent media orchestration assistant.
- **Support Tickets**: Automated ticketing system with email notifications.
- **Modern UI**: Glassmorphism design built with Tailwind CSS and Framer Motion.

Developed by **Shashwat Baswade**
