from rest_framework import serializers
from apps.integrations.models import ConnectedAccount

class ConnectedAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectedAccount
        fields = ["id", "platform", "handle", "profile_url", "status", "verification_code", "verified_at", "verification_note", "latest_metrics", "last_synced_at", "created_at"]
        read_only_fields = ["id", "status", "verification_code", "verified_at", "verification_note", "latest_metrics", "last_synced_at", "created_at"]

class ConnectedAccountCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectedAccount
        fields = ["platform", "handle", "profile_url", "campaign"]

class VerifyAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectedAccount
        fields = ["status", "verification_note"]
