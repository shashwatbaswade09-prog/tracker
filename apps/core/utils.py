import random
import string
from django.utils import timezone
from datetime import timedelta
from .models import OTP

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def create_otp(email=None, user=None, purpose=OTP.Purpose.REGISTRATION):
    code = generate_otp()
    expires_at = timezone.now() + timedelta(minutes=10) # 10 minute expiry
    
    otp = OTP.objects.create(
        email=email if email else "",
        user=user,
        code=code,
        purpose=purpose,
        expires_at=expires_at
    )
    
    # In a real app, send email here.
    # For now, we log it to console.
    print(f"========================================")
    print(f" OTP GENERATED FOR {email or user}")
    print(f" PURPOSE: {purpose}")
    print(f" CODE: {code}")
    print(f"========================================")
    
    return otp

def verify_otp(identifier, code, purpose):
    """
    Identifier can be email (for registration) or user object
    """
    now = timezone.now()
    
    query = OTP.objects.filter(
        code=code,
        purpose=purpose,
        is_verified=False,
        expires_at__gt=now
    )
    
    if isinstance(identifier, str): # Email
        query = query.filter(email=identifier)
    else: # User object
        query = query.filter(user=identifier)
        
    otp = query.first()
    
    if otp:
        otp.is_verified = True
        otp.save()
        return True
    return False
