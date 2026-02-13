from celery import shared_task
from django.utils import timezone
from apps.submissions.models import Submission, AnalyticsSnapshot
from apps.submissions.analytics_providers import get_provider

@shared_task
def fetch_submission_analytics(submission_id):
    try:
        submission = Submission.objects.get(id=submission_id)
        
        # Determine provider
        provider = get_provider(submission.platform)
        
        # Get Access Token if needed
        access_token = None
        if submission.platform in ['TIKTOK', 'INSTAGRAM']:
            from apps.integrations.models import ConnectedAccount
            try:
                account = ConnectedAccount.objects.get(
                    user=submission.user,
                    platform=submission.platform,
                    status=ConnectedAccount.Status.VERIFIED
                )
                access_token = account.access_token
            except ConnectedAccount.DoesNotExist:
                print(f"No connected account found for {submission.user} on {submission.platform}")
        
        # Fetch Data
        data = provider.fetch_analytics(submission.normalized_url, access_token=access_token)
        
        AnalyticsSnapshot.objects.create(
            submission=submission,
            views=data.get("views", 0),
            likes=data.get("likes", 0),
            comments=data.get("comments", 0),
            shares=data.get("shares", 0),
            fetched_at=timezone.now()
        )
        return f"Fetched analytics for submission {submission_id}"
    except Submission.DoesNotExist:
        return f"Submission {submission_id} not found"
    except Exception as e:
        return f"Error fetching analytics for {submission_id}: {str(e)}"

@shared_task
def refresh_campaign_analytics(campaign_id):
    submissions = Submission.objects.filter(campaign_id=campaign_id, status=Submission.Status.ACTIVE)
    for sub in submissions:
        fetch_submission_analytics.delay(sub.id)
    return f"Triggered refresh for {submissions.count()} submissions in campaign {campaign_id}"

@shared_task
def refresh_all_active_submissions():
    submissions = Submission.objects.filter(status=Submission.Status.ACTIVE)
    for sub in submissions:
        fetch_submission_analytics.delay(sub.id)
    return f"Triggered refresh for {submissions.count()} submissions"
