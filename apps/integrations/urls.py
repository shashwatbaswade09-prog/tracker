from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.integrations.views import ConnectedAccountViewSet, MixpostViewSet

router = DefaultRouter()
router.register(r"connected-accounts", ConnectedAccountViewSet, basename="connected-account")
router.register(r"mixpost", MixpostViewSet, basename="mixpost")

urlpatterns = [
    path("", include(router.urls)),
]
