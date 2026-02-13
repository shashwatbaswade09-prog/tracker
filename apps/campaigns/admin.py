from django.contrib import admin
from apps.campaigns.models import Campaign, CreatorGroup, Creator, CampaignMembership

class CreatorGroupInline(admin.TabularInline):
    model = CreatorGroup
    extra = 1

class CreatorInline(admin.TabularInline):
    model = Creator
    extra = 1

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ("name", "start_date", "end_date", "is_active", "created_by")
    list_filter = ("is_active", "start_date")
    search_fields = ("name", "description")
    inlines = [CreatorGroupInline]

@admin.register(CreatorGroup)
class CreatorGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "campaign")
    list_filter = ("campaign",)
    inlines = [CreatorInline]

@admin.register(Creator)
class CreatorAdmin(admin.ModelAdmin):
    list_display = ("name", "group", "platform", "profile_url")
    list_filter = ("group__campaign", "platform")
    search_fields = ("name",)

@admin.register(CampaignMembership)
class CampaignMembershipAdmin(admin.ModelAdmin):
    list_display = ("user", "campaign", "status", "joined_at")
    list_filter = ("status", "campaign")
