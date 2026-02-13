from rest_framework import serializers
from apps.submissions.models import Submission, AnalyticsSnapshot
from apps.integrations.models import ConnectedAccount
from apps.campaigns.models import CampaignMembership

class AnalyticsSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsSnapshot
        fields = ["id", "fetched_at", "views", "likes", "comments", "shares"]

class SubmissionSerializer(serializers.ModelSerializer):
    latest_analytics = serializers.SerializerMethodField()
    user_details = serializers.SerializerMethodField()
    campaign_details = serializers.SerializerMethodField()
    money_owed = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = ["id", "campaign", "creator", "platform", "title", "original_url", "normalized_url", "posted_at", "submitted_at", "status", "rejection_reason", "latest_analytics", "user_details", "campaign_details", "money_owed"]
        read_only_fields = ["id", "normalized_url", "submitted_at", "status", "rejection_reason", "latest_analytics", "user_details", "campaign_details", "money_owed"]

    def get_user_details(self, obj):
        return {
            "username": obj.user.username,
            "display_name": obj.user.display_name,
            "whop_email": obj.user.whop_email
        }

    def get_campaign_details(self, obj):
        return {
            "id": obj.campaign.id,
            "name": obj.campaign.name,
            # Add icon if available, or platform
        }

    def get_latest_analytics(self, obj):
        snapshot = obj.analytics_snapshots.first() # Ordered by -fetched_at
        if snapshot:
            return AnalyticsSnapshotSerializer(snapshot).data
        return None
    
    def get_money_owed(self, obj):
        snapshot = obj.analytics_snapshots.first()
        views = snapshot.views if snapshot else 0
        cpm = obj.campaign.cpm
        # Formula: (Views / 1000) * CPM
        earnings = (views / 1000) * float(cpm)
        return round(earnings, 2)
    
    def validate(self, data):
        user = self.context.get("request").user
        campaign = data.get("campaign")
        platform = data.get("platform")

        # 1. Check Campaign Membership
        if not CampaignMembership.objects.filter(campaign=campaign, user=user, status=CampaignMembership.Status.APPROVED).exists():
            raise serializers.ValidationError("You must be an active member of this campaign to submit.")

        # 2. Check Connected Account
        connected_account = ConnectedAccount.objects.filter(user=user, platform=platform, status=ConnectedAccount.Status.VERIFIED).first()
        if not connected_account:
            print(f"DEBUG: No verified account found for user {user} on {platform}")
            raise serializers.ValidationError(f"Please connect and verify your {platform} account before submitting.")

        # 3. Strict Verification: Check if URL matches handle
        # NOTE: Instagram Reels/YouTube Shorts URLs often DO NOT contain the username/handle. 
        # (e.g. instagram.com/reel/ID, youtube.com/shorts/ID)
        # We can only strictly verify via string match for platforms like TikTok or Twitter.
        # For IG/YT, we would need the API to fetch the post author, which we don't have here.
        
        handle = connected_account.handle.lstrip('@').lower()
        url = data.get("original_url", "").lower()

        if platform in ['TIKTOK', 'TWITTER', 'OTHER']:
            if handle not in url:
                print(f"DEBUG: Handle mismatch. {handle} not in {url}")
                raise serializers.ValidationError(f"The submission URL must contain your verified handle (@{handle}).")
        
        # For Instagram/YouTube, we rely on the fact that they HAVE a connected account (Step 2).
        # We can't strictly verify ownership without API.
        
        return data

    def create(self, validated_data):
        validated_data["user"] = self.context.get("request").user
        # TODO: Normalize URL logic here or in model save()
        validated_data["normalized_url"] = validated_data["original_url"] 
        return super().create(validated_data)
