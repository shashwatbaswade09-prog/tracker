from django.core.management.base import BaseCommand
from apps.campaigns.models import Campaign, Creator, CreatorGroup, CampaignMembership
from apps.submissions.models import Submission

class Command(BaseCommand):
    help = "Clears all Campaigns and Submissions (dummy data)"

    def handle(self, *args, **kwargs):
        self.stdout.write("Clearing data...")
        
        # Delete Submissions first (FK dependencies)
        deleted_subs, _ = Submission.objects.all().delete()
        self.stdout.write(f"Deleted {deleted_subs} Submissions")

        # Delete Campaigns (cascades to Groups/Creators/Memberships)
        deleted_campaigns, _ = Campaign.objects.all().delete()
        self.stdout.write(f"Deleted {deleted_campaigns} Campaigns")
        
        self.stdout.write(self.style.SUCCESS("Data cleared successfully."))
