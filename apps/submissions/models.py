from django.db import models
from django.conf import settings
from apps.campaigns.models import Campaign, Creator
from apps.integrations.models import ConnectedAccount

class Submission(models.Model):
    class Platform(models.TextChoices):
        TIKTOK = "TIKTOK", "TikTok"
        INSTAGRAM = "INSTAGRAM", "Instagram"
        YOUTUBE = "YOUTUBE", "YouTube"
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        REMOVED = "REMOVED", "Removed"

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="submissions")
    creator = models.ForeignKey(Creator, on_delete=models.SET_NULL, null=True, blank=True, related_name="submissions")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="submissions")
    platform = models.CharField(max_length=50, choices=Platform.choices)
    title = models.CharField(max_length=255, blank=True, help_text="Title or caption of the content")
    original_url = models.URLField(max_length=2000)
    normalized_url = models.URLField(max_length=2000, help_text="Cleaned URL for tracking.")
    posted_at = models.DateTimeField(null=True, blank=True, help_text="When the content was posted on the platform.")
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    rejection_reason = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.normalized_url:
            self.normalized_url = self.original_url
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user} - {self.platform} ({self.id})"

class AnalyticsSnapshot(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="analytics_snapshots")
    fetched_at = models.DateTimeField(auto_now_add=True)
    views = models.BigIntegerField(default=0)
    likes = models.BigIntegerField(default=0)
    comments = models.BigIntegerField(default=0)
    shares = models.BigIntegerField(default=0)
    extra_data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-fetched_at"]

    def __str__(self):
        return f"Snapshot for {self.submission_id} at {self.fetched_at}"
