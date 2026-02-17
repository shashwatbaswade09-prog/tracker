from celery import shared_task
from django.utils import timezone
from apps.integrations.models import ConnectedAccount
from apps.submissions.analytics_providers import get_provider

@shared_task
def sync_account_metrics(account_id):
    """Refreshes metrics for a specific connected account"""
    try:
        account = ConnectedAccount.objects.get(id=account_id)
        provider = get_provider(account.platform)
        
        # Fetch metrics using handle (fallback) or access_token (real OAuth)
        metrics = provider.fetch_analytics(account.handle, access_token=account.access_token)
        
        # Update account
        account.latest_metrics = metrics
        account.last_synced_at = timezone.now()
        account.save()
        
        return f"Synced metrics for {account.handle} on {account.platform}"
    except ConnectedAccount.DoesNotExist:
        return f"Account {account_id} not found"
    except Exception as e:
        return f"Error syncing account {account_id}: {str(e)}"

@shared_task
def sync_all_verified_accounts():
    """Periodic task to refresh all verified accounts"""
    accounts = ConnectedAccount.objects.filter(status=ConnectedAccount.Status.VERIFIED)
    for account in accounts:
        sync_account_metrics.delay(account.id)
    return f"Triggered sync for {accounts.count()} accounts"
