from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.submissions.views import SubmissionViewSet, ClipperDashboardView, AdminDashboardView

router = DefaultRouter()
router.register(r"", SubmissionViewSet, basename="submission")

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/clipper/", ClipperDashboardView.as_view(), name="clipper-dashboard"),
    path("dashboard/admin/", AdminDashboardView.as_view(), name="admin-dashboard"),
]
