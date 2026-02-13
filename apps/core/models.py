from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        EDITOR = "EDITOR", "Editor"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.EDITOR,
        help_text="User role determines access level."
    )
    display_name = models.CharField(max_length=255, blank=True)
    whop_email = models.EmailField(
        blank=True, 
        null=True, 
        help_text="Email used for Whop payout/reference."
    )
    
    # We use date_joined from AbstractUser for created_at

    def __str__(self):
        return f"{self.username} ({self.role})"
    
    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN
    
    @property
    def is_editor(self):
        return self.role == self.Role.EDITOR

    def save(self, *args, **kwargs):
        if self.role == self.Role.ADMIN:
            self.is_staff = True
            self.is_superuser = True
        else:
            # Editors are staff but not superusers? Or just regular users?
            # Request says "Admin Dashboard" and "Editor Dashboard". 
            # Usually Editors don't need Django Admin access, so is_staff=False.
            # But previous code set is_staff=True for Editors. 
            # Given "Admin Dashboard" implies custom UI, let's keep is_staff=False for Editors to avoid confusion, 
            # or True if they need to access Django Admin. 
            # User request: "Editor Dashboard... my campaigns... discover". This is a custom App, not Django Admin.
            # So is_staff can be False for Editors.
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)

class OTP(models.Model):
    class Purpose(models.TextChoices):
        REGISTRATION = "REGISTRATION", "Registration"
        PASSWORD_RESET = "PASSWORD_RESET", "Password Reset"
        SOCIAL_VERIFICATION = "SOCIAL_VERIFICATION", "Social Verification"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otps", null=True, blank=True)
    email = models.EmailField(blank=True, help_text="For registration before user is created")
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=Purpose.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)

    def is_valid(self):
        return not self.is_verified and self.expires_at > timezone.now()

    def __str__(self):
        return f"{self.code} ({self.purpose}) - {self.email or self.user}"
