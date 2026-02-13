from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.core.models import User
from apps.campaigns.models import Campaign, CreatorGroup, Creator, CampaignMembership
from apps.integrations.models import ConnectedAccount
from apps.submissions.models import Submission, AnalyticsSnapshot
import random
from datetime import timedelta

class Command(BaseCommand):
    help = "Seeds the database with realistic data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # 1. Create Users
        admin, _ = User.objects.get_or_create(username="admin", defaults={"email": "admin@nexus.com", "role": User.Role.ADMIN, "display_name": "Admin User"})
        if _: admin.set_password("admin"); admin.save()
        
        editor, _ = User.objects.get_or_create(username="editor", defaults={"email": "editor@nexus.com", "role": User.Role.EDITOR, "display_name": "Editor User"})
        if _: editor.set_password("editor"); editor.save()

        self.stdout.write(self.style.SUCCESS("Database seeded with Admin and Editor users only."))
