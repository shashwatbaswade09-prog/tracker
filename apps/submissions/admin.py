from django.contrib import admin
from .models import Submission, AnalyticsSnapshot
from apps.integrations.models import ConnectedAccount

class AnalyticsSnapshotInline(admin.TabularInline):
    model = AnalyticsSnapshot
    extra = 0
    readonly_fields = ("fetched_at", "views", "likes", "comments", "shares")
    can_delete = False

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("user", "campaign", "platform", "status", "submitted_at", "posted_at")
    list_filter = ("status", "platform", "campaign")
    search_fields = ("original_url", "user__username")
    inlines = [AnalyticsSnapshotInline]
    actions = ["approve_submissions", "reject_submissions"]

    def approve_submissions(self, request, queryset):
        queryset.update(status="ACTIVE")
    
    def reject_submissions(self, request, queryset):
        queryset.update(status="REJECTED")

@admin.register(ConnectedAccount)
class ConnectedAccountAdmin(admin.ModelAdmin):
    list_display = ("user", "platform", "handle", "status", "verified_at")
    list_filter = ("status", "platform")
    search_fields = ("handle", "user__username")
    actions = ["verify_accounts", "reject_accounts"]

    def verify_accounts(self, request, queryset):
        from django.utils import timezone
        queryset.update(status="VERIFIED", verified_at=timezone.now())

    def reject_accounts(self, request, queryset):
        queryset.update(status="REJECTED")
