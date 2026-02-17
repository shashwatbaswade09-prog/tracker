import os
import django
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.integrations.models import ConnectedAccount
from apps.submissions.analytics_providers import get_provider

def run_sync():
    accounts = ConnectedAccount.objects.filter(status=ConnectedAccount.Status.VERIFIED)
    print(f"Syncing {accounts.count()} accounts...")
    for a in accounts:
        try:
            p = get_provider(a.platform)
            m = p.fetch_analytics(a.handle, access_token=a.access_token)
            a.latest_metrics = m
            a.last_synced_at = timezone.now()
            a.save()
            print(f"Synced {a.handle}")
        except Exception as e:
            print(f"Error syncing {a.handle}: {e}")

if __name__ == "__main__":
    run_sync()
