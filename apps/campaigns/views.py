from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.campaigns.models import Campaign
from apps.campaigns.serializers import CampaignSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin

from apps.campaigns.models import CampaignMembership
from apps.campaigns.serializers import CampaignMembershipSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer
    
    def get_queryset(self):
        return Campaign.objects.all()

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy", "applications", "approve_application", "reject_application"]:
            return [IsAdminUser()]
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        campaign = self.get_object()
        user = request.user
        
        # Check if already joined
        membership, created = CampaignMembership.objects.get_or_create(campaign=campaign, user=user)
        
        if not created:
             # Already applied or joined
             return Response({
                 "status": membership.status, 
                 "detail": "You have already applied or joined this campaign."
             }, status=status.HTTP_200_OK)

        # New application -> PENDING
        membership.status = CampaignMembership.Status.PENDING
        membership.application_data = request.data.get("application_data", {})
        membership.save()
            
        return Response({"status": "PENDING", "detail": "Application submitted."}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], permission_classes=[IsAdminUser])
    def applications(self, request, pk=None):
        campaign = self.get_object()
        memberships = CampaignMembership.objects.filter(campaign=campaign, status=CampaignMembership.Status.PENDING)
        serializer = CampaignMembershipSerializer(memberships, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="applications/(?P<user_id>\d+)/approve", permission_classes=[IsAdminUser])
    def approve_application(self, request, pk=None, user_id=None):
        campaign = self.get_object()
        try:
            membership = CampaignMembership.objects.get(campaign=campaign, user_id=user_id)
            membership.status = CampaignMembership.Status.APPROVED
            membership.save()
            return Response({"status": "APPROVED"})
        except CampaignMembership.DoesNotExist:
            return Response({"detail": "Membership not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["get"], permission_classes=[IsAdminUser])
    def pending_applications(self, request):
        memberships = CampaignMembership.objects.filter(status=CampaignMembership.Status.PENDING).select_related('user', 'campaign')
        serializer = CampaignMembershipSerializer(memberships, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="applications/(?P<user_id>\d+)/reject", permission_classes=[IsAdminUser])
    def reject_application(self, request, pk=None, user_id=None):
        campaign = self.get_object()
        try:
            membership = CampaignMembership.objects.get(campaign=campaign, user_id=user_id)
            membership.status = CampaignMembership.Status.REJECTED
            membership.save()
            return Response({"status": "REJECTED"})
        except CampaignMembership.DoesNotExist:
            return Response({"detail": "Membership not found"}, status=status.HTTP_404_NOT_FOUND)
    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def my_campaigns(self, request):
        user = request.user
        # Get campaigns where user has a membership (PENDING, APPROVED, REJECTED)
        # Assuming we want to show all interactions. 
        # User said "only show the campaigns the user is enrolled in".
        # Enrolled usually means Approved or maybe Pending too. 
        # Let's filter by membership existence for now.
        campaigns = Campaign.objects.filter(memberships__user=user).distinct()
        serializer = self.get_serializer(campaigns, many=True)
        return Response(serializer.data)
