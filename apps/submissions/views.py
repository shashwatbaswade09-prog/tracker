from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum
from apps.submissions.models import Submission, AnalyticsSnapshot
from apps.submissions.serializers import SubmissionSerializer, AnalyticsSnapshotSerializer

class IsOwnerOrEditor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_editor or request.user.is_staff or request.user.role == 'ADMIN'

class SubmissionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrEditor]
    serializer_class = SubmissionSerializer
    filterset_fields = ["campaign", "platform", "status"]

    def perform_create(self, serializer):
        submission = serializer.save()
        from apps.submissions.tasks import fetch_submission_analytics
        fetch_submission_analytics.delay(submission.id)

    def get_queryset(self):
        user = self.request.user
        # ADMINS see all
        if user.is_staff or user.role == "ADMIN":
            return Submission.objects.all().select_related("campaign", "user").prefetch_related("analytics_snapshots")
        # EDITORS/CREATORS see only their own
        return Submission.objects.filter(user=user).select_related("campaign").prefetch_related("analytics_snapshots")

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        if not (request.user.is_staff or request.user.role == 'ADMIN'):
             return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        submission = self.get_object()
        submission.status = Submission.Status.APPROVED
        submission.save()
        return Response(SubmissionSerializer(submission).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        if not (request.user.is_staff or request.user.role == 'ADMIN'):
             return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        submission = self.get_object()
        submission.status = Submission.Status.REJECTED
        submission.save()
        return Response(SubmissionSerializer(submission).data)

    @action(detail=True, methods=["get"])
    def analytics(self, request, pk=None):
        submission = self.get_object()
        snapshots = submission.analytics_snapshots.all()
        return Response(AnalyticsSnapshotSerializer(snapshots, many=True).data)

class ClipperDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        submissions = Submission.objects.filter(user=user)
        
        # Calculate total views from latest snapshots
        total_views = 0
        for sub in submissions:
            latest = sub.analytics_snapshots.first()
            if latest:
                total_views += latest.views

        total_submissions = submissions.count()
        
        return Response({
            "total_views": total_views,
            "total_submissions": total_submissions,
            "money_earned": 0, # Placeholder
        })

class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_views = AnalyticsSnapshot.objects.aggregate(Sum("views"))["views__sum"] or 0
        total_submissions = Submission.objects.count()
        
        return Response({
            "total_views": total_views,
            "total_submissions": total_submissions,
            # Add more aggregate stats here
        })
