from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.campaigns.models import Campaign, Creator
from apps.submissions.models import Submission, AnalyticsSnapshot
from apps.integrations.models import ConnectedAccount
from apps.core.models import User

class Command(BaseCommand):
    help = 'Wipes all data from the database except superusers'

    def add_arguments(self, parser):
        parser.add_argument(
            '--no-input',
            action='store_true',
            help='Do not prompt for confirmation',
        )

    def handle(self, *args, **options):
        if not options['no_input']:
            self.stdout.write(self.style.WARNING('This will wipe all data except superusers. Are you sure? (yes/no)'))
            confirmation = input()
            
            if confirmation != 'yes':
                self.stdout.write(self.style.ERROR('Operation cancelled.'))
                return

        submission_count = Submission.objects.count()
        self.stdout.write(f'Deleting {submission_count} Submissions...')
        AnalyticsSnapshot.objects.all().delete()
        Submission.objects.all().delete()
        
        account_count = ConnectedAccount.objects.count()
        self.stdout.write(f'Deleting {account_count} Connected Accounts...')
        ConnectedAccount.objects.all().delete()
        
        campaign_count = Campaign.objects.count()
        self.stdout.write(f'Deleting {campaign_count} Campaigns...')
        Campaign.objects.all().delete()
        Creator.objects.all().delete()
        
        User = get_user_model()
        deleted_users, _ = User.objects.filter(is_superuser=False, is_staff=False).delete()
        self.stdout.write(f'Deleting {deleted_users} non-superuser Users...')
        
        self.stdout.write(self.style.SUCCESS('Database wiped successfully!'))
