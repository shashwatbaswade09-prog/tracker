from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from apps.core.serializers import (
    UserSerializer, RegisterSerializer, VerifyOTPSerializer, 
    ForgotPasswordSerializer, ResetPasswordSerializer
)
from apps.core.serializers_password import ChangePasswordSerializer
from apps.core.models import OTP
from apps.core.utils import create_otp, verify_otp

User = get_user_model()

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            # Generate OTP
            create_otp(email=email, purpose=OTP.Purpose.REGISTRATION)
            return Response(
                {"detail": "OTP sent to email. Please verify to complete registration."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data['code']
            purpose = serializer.validated_data['purpose']
            
            if verify_otp(email, code, purpose):
                if purpose == 'REGISTRATION':
                    # Create User
                    if User.objects.filter(email=email).exists():
                         return Response({"detail": "User already exists."}, status=status.HTTP_400_BAD_REQUEST)
                         
                    user = User.objects.create_user(
                        username=serializer.validated_data['username'],
                        email=email,
                        password=serializer.validated_data['password'],
                        display_name=serializer.validated_data.get('display_name', ''),
                        whop_email=serializer.validated_data.get('whop_email', ''),
                        role=User.Role.EDITOR # Default to Editor
                    )
                    return Response({"detail": "User created successfully."}, status=status.HTTP_201_CREATED)
                
                elif purpose == 'PASSWORD_RESET':
                     # Just return success, client acts on it
                     return Response({"detail": "OTP verified."}, status=status.HTTP_200_OK)

            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user:
                create_otp(user=user, email=email, purpose=OTP.Purpose.PASSWORD_RESET)
            # Always return 200 for security
            return Response(
                {"detail": "If an account exists, an OTP has been sent."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data['code']
            new_password = serializer.validated_data['new_password']
            
            if verify_otp(email, code, OTP.Purpose.PASSWORD_RESET):
                user = User.objects.get(email=email)
                user.set_password(new_password)
                user.save()
                return Response({"detail": "Password reset successfully."}, status=status.HTTP_200_OK)
            
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ConfigView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            "community_url": "https://discord.gg/nexus-community",
            "support": {
                "enabled": True,
                "provider": "crisp",
                "widget_key": "replaceme-uuid"
            }
        })

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response("Success.", status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
