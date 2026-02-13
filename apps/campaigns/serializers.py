from rest_framework import serializers
from apps.campaigns.models import Campaign, CreatorGroup, Creator, CampaignMembership
from apps.core.serializers import UserSerializer

class CreatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Creator
        fields = ["id", "name", "platform", "profile_url", "avatar_url"]

class CreatorGroupSerializer(serializers.ModelSerializer):
    creators = CreatorSerializer(many=True, required=False)

    class Meta:
        model = CreatorGroup
        fields = ["id", "name", "description", "creators"]

class CampaignSerializer(serializers.ModelSerializer):
    creator_groups = CreatorGroupSerializer(many=True, required=False)
    is_joined = serializers.SerializerMethodField()
    membership_status = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            "id", "name", "description", "rules_markdown", "is_active", 
            "start_date", "end_date", "budget_total", "budget_paid", 
            "budget_remaining", "percent_paid", "cpm",
            "creator_groups", "member_count", "is_joined", "membership_status"
        ]

    def create(self, validated_data):
        groups_data = validated_data.pop('creator_groups', [])
        campaign = Campaign.objects.create(**validated_data)
        
        for group_data in groups_data:
            creators_data = group_data.pop('creators', [])
            group = CreatorGroup.objects.create(campaign=campaign, **group_data)
            for creator_data in creators_data:
                Creator.objects.create(group=group, **creator_data)
        
        return campaign

    def get_is_joined(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return CampaignMembership.objects.filter(campaign=obj, user=request.user).exists()
        return False
        
    def get_membership_status(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            membership = CampaignMembership.objects.filter(campaign=obj, user=request.user).first()
            return membership.status if membership else None
        return None

    def get_member_count(self, obj):
        return obj.memberships.count()

class CampaignMembershipSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    campaign_details = CampaignSerializer(source='campaign', read_only=True)
    
    class Meta:
        model = CampaignMembership
        fields = ["id", "campaign", "user", "status", "application_data", "joined_at", "user_details", "campaign_details"]
