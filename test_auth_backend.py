from jose import jwt
from datetime import datetime, timedelta, timezone
from app.config.settings import get_settings
import requests

settings = get_settings()

def create_token(user_id, email):
    data = {"sub": user_id, "email": email}
    expire = datetime.now(timezone.utc) + timedelta(minutes=60)
    data.update({"exp": expire})
    return jwt.encode(data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# ID 2 is whopuser
token = create_token(2, "whop_test@nexus.com")
print(f"Generated Token: {token}")

response = requests.get(
    "http://localhost:8000/api/v1/auth/me",
    headers={"Authorization": f"Bearer {token}"}
)

print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.json()}")
