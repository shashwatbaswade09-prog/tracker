from django.db import models
from django.conf import settings
from django.utils import timezone

class Campaign(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    rules_markdown = models.TextField(blank=True, help_text="Markdown rules for the campaign.")
    is_active = models.BooleanField(default=True)
    image = models.ImageField(upload_to="campaigns", null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name="created_campaigns"
    )
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    
    # Budget fields
    budget_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Total budget for the campaign")
    budget_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Amount already paid out")
    cpm = models.DecimalField(max_digits=10, decimal_places=2, default=10.00, help_text="Cost per 1000 views")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "campaigns"

    def __str__(self):
        return self.name
        
    @property
    def budget_remaining(self):
        return max(self.budget_total - self.budget_paid, 0)
        
    @property
    def percent_paid(self):
        if self.budget_total == 0:
            return 0
        return int((self.budget_paid / self.budget_total) * 100)

class CreatorGroup(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="creator_groups")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.campaign.name})"

class Creator(models.Model):
    group = models.ForeignKey(CreatorGroup, on_delete=models.CASCADE, related_name="creators")
    name = models.CharField(max_length=255)
    platform = models.CharField(max_length=50, blank=True, help_text="Primary platform (e.g. Twitch, YouTube)")
    profile_url = models.URLField(blank=True)
    avatar_url = models.URLField(blank=True, null=True)

    class Meta:
        app_label = "campaigns"

    def __str__(self):
        return self.name

class CampaignMembership(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending (Waitlist)"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        BANNED = "BANNED", "Banned"
        LEFT = "LEFT", "Left"

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="memberships")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="campaign_memberships")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    application_data = models.JSONField(default=dict, blank=True, help_text="Answers to application questions")
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("campaign", "user")
        app_label = "campaigns"

    def __str__(self):
        return f"{self.user} in {self.campaign}"
