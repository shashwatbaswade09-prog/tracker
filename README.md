# Nexus Backend API

## Setup

1.  **Clone the repository**
2.  **Environment Variables**: Copy `.env.example` to `.env`.
3.  **Docker Start**:
    ```bash
    docker-compose up --build
    ```
4.  **Run Migrations & Seed**:
    ```bash
    docker-compose exec web python manage.py migrate
    docker-compose exec web python manage.py seed
    ```
5.  **Access API**:
    -   API Root: `http://localhost:8000/api/`
    -   Admin Panel: `http://localhost:8000/admin/` (User: `admin`, Pass: `admin`)
    -   Swagger Docs: `http://localhost:8000/api/docs/`

## Apps

-   **Core**: Auth, Users, Config.
-   **Campaigns**: Campaign management, Creator groups.
-   **Submissions**: Link submissions, Analytics.
-   **Integrations**: Connected social accounts.

## API Usage

### Auth
-   POST `/api/auth/register/` - Register new clipper.
-   POST `/api/auth/login/` - Login (Get JWT).

### Flow
1.  **Login** as a Clipper.
2.  **View Campaigns**: GET `/api/campaigns/`
3.  **Join Campaign**: POST `/api/campaigns/{id}/join/`
4.  **Connect Account**: POST `/api/integrations/connected-accounts/` (Platform: TIKTOK, etc.)
5.  **Submit Link**: POST `/api/submissions/`
6.  **View Dashboard**: GET `/api/dashboard/clipper/`

## Worker

Celery worker runs in the background to fetch analytics. Use `fetch_submission_analytics` task.
