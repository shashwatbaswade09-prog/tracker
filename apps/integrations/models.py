from django.db import models
from django.conf import settings

from apps.campaigns.models import Campaign

class ConnectedAccount(models.Model):
    class Platform(models.TextChoices):
        TIKTOK = "TIKTOK", "TikTok"
        INSTAGRAM = "INSTAGRAM", "Instagram"
        YOUTUBE = "YOUTUBE", "YouTube"
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="connected_accounts")
    platform = models.CharField(max_length=50, choices=Platform.choices)
    handle = models.CharField(max_length=255)
    profile_url = models.URLField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    verification_code = models.CharField(max_length=10, blank=True, null=True, help_text="Code to put in bio for verification")
    verified_at = models.DateTimeField(null=True, blank=True)
    verification_note = models.TextField(blank=True, help_text="Admin notes on verification.")
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, blank=True, related_name="connected_accounts", help_text="Campaign this account is linked to (optional)")
    
    # OAuth Tokens for Real Analytics
    access_token = models.TextField(blank=True, null=True, help_text="OAuth access token for API access")
    refresh_token = models.TextField(blank=True, null=True, help_text="OAuth refresh token")
    token_expires_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "platform", "handle")

    def __str__(self):
        return f"{self.user} - {self.platform} ({self.handle})"
