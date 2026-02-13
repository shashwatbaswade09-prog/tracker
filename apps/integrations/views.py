from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from apps.integrations.models import ConnectedAccount
from apps.integrations.serializers import ConnectedAccountSerializer, ConnectedAccountCreateSerializer, VerifyAccountSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_admin

class ConnectedAccountViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return ConnectedAccount.objects.all()
        return ConnectedAccount.objects.filter(user=user)

    def get_serializer_class(self):
        if self.action == "create":
            return ConnectedAccountCreateSerializer
        if self.action == "verify":
            return VerifyAccountSerializer
        return ConnectedAccountSerializer

    def perform_create(self, serializer):
        import random
        import string
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        serializer.save(user=self.request.user, status=ConnectedAccount.Status.PENDING, verification_code=code)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def verify_bio(self, request, pk=None):
        """
        Real verification: Checks if the verification_code is present in the profile page body.
        Mock Bypass: If handle ends with "_demo", automatically verify.
        """
        account = self.get_object()
        if account.status == ConnectedAccount.Status.VERIFIED:
             return Response({"detail": "Already verified"}, status=status.HTTP_400_BAD_REQUEST)

        # Mock Logic for Dev/Testing:
        if account.handle.endswith("_demo"):
             account.status = ConnectedAccount.Status.VERIFIED
             account.verified_at = timezone.now()
             account.save()
             return Response(ConnectedAccountSerializer(account).data)

        # Real Logic (Simple Scraper)
        # Real Logic (RapidAPI Scraper)
        try:
            import requests
            import os
            
            # Extract username from profile URL
            # Expected format: https://instagram.com/username/ or https://instagram.com/username
            url = account.profile_url.rstrip('/')
            username = url.split('/')[-1]
            # Handle query params if present
            if '?' in username:
                username = username.split('?')[0]

            print(f"DEBUG: Verifying user {username} for code {account.verification_code}")

            rapid_api_key = os.getenv("RAPIDAPI_KEY")
            rapid_api_host = os.getenv("RAPIDAPI_HOST", "instagram-scraper-2022.p.rapidapi.com")

            if not rapid_api_key:
                 return Response({"detail": "Server Error: RapidAPI Key not configured."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # RapidAPI Request
            api_url = f"https://{rapid_api_host}/ig/info_username/"
            querystring = {"user": username}
            headers = {
                "X-RapidAPI-Key": rapid_api_key,
                "X-RapidAPI-Host": rapid_api_host
            }

            response = requests.get(api_url, headers=headers, params=querystring)
            print(f"DEBUG: RapidAPI Status {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                # Adjust based on specific API response structure
                # For instagram-scraper-2022: data['user']['biography']
                user_info = data.get("user", {})
                biography = user_info.get("biography", "")

                if account.verification_code in biography:
                    account.status = ConnectedAccount.Status.VERIFIED
                    account.verified_at = timezone.now()
                    # Store the numeric ID if available for better scraping later
                    # account.remote_id = user_info.get("pk") 
                    account.save()
                    return Response(ConnectedAccountSerializer(account).data)
                else:
                    return Response(
                        {"detail": f"Verification code '{account.verification_code}' NOT found in bio. \nFound bio: '{biography}'"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                 return Response(
                     {"detail": f"Could not fetch profile via Scraper. Status: {response.status_code}. Details: {response.text}"}, 
                     status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            return Response({"detail": f"Verification failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=["patch"], permission_classes=[permissions.IsAdminUser])
    def verify(self, request, pk=None):
        account = self.get_object()
        serializer = VerifyAccountSerializer(account, data=request.data, partial=True)
        if serializer.is_valid():
            status_val = serializer.validated_data.get("status")
            if status_val == ConnectedAccount.Status.VERIFIED:
                serializer.save(verified_at=timezone.now())
            else:
                serializer.save()
            return Response(ConnectedAccountSerializer(account).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # -------------------------------------------------------------------------
    # OAuth Actions (Phase 5)
    # -------------------------------------------------------------------------

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def connect_tiktok(self, request):
        """Generates the TikTok OAuth URL"""
        import os
        from django.conf import settings
        
        client_key = os.getenv("TIKTOK_CLIENT_KEY")
        if not client_key:
            return Response({"detail": "TikTok Client Key not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Build redirect URI based on frontend URL handling the callback first? 
        # Actually usually easier to handle callback on frontend, then frontend calls backend.
        # But here we want backend to handle exchange.
        # Let's say Frontend redirects here -> we redirect to TikTok -> TikTok redirects to Frontend -> Frontend sends code here.
        
        # Simplified: Return the URL to Frontend, Frontend opens it.
        csrf_state = "tiktok_random_string" # Should use proper CSRF
        redirect_uri = f"{settings.CORS_ALLOWED_ORIGINS[0]}/integrations/callback"
        
        url = (
            "https://www.tiktok.com/v2/auth/authorize/"
            f"?client_key={client_key}"
            "&scope=user.info.basic,video.list"
            "&response_type=code"
            f"&redirect_uri={redirect_uri}"
            f"&state={csrf_state}"
        )
        return Response({"url": url})

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def connect_instagram(self, request):
        """
        Generates the Facebook/Instagram OAuth URL (Graph API).
        Users must login with Facebook to grant Instagram Business permissions.
        """
        import os
        from django.conf import settings
        
        # We reuse the same Env Var, assuming it holds the Meta App ID
        app_id = os.getenv("INSTAGRAM_APP_ID")
        if not app_id:
             return Response({"detail": "Instagram App ID not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        redirect_uri = f"{settings.CORS_ALLOWED_ORIGINS[0]}/integrations/callback"
        csrf_state = "instagram_connection"
        
        # Use Facebook Login for Instagram Graph API
        url = (
            "https://www.facebook.com/v19.0/dialog/oauth"
            f"?client_id={app_id}"
            f"&redirect_uri={redirect_uri}"
            "&scope=instagram_manage_insights,pages_show_list,pages_read_engagement"
            "&response_type=code"
            f"&state={csrf_state}"
        )
        return Response({"url": url})

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def oauth_exchange(self, request):
        """
        Exchanges the 'code' from frontend for an access token.
        Expected payload: { "platform": "TIKTOK" | "INSTAGRAM", "code": "..." }
        """
        platform = request.data.get("platform")
        code = request.data.get("code")
        
        if not platform or not code:
            return Response({"detail": "Platform and code required"}, status=status.HTTP_400_BAD_REQUEST)

        import os
        import requests
        from django.conf import settings
        
        frontend_redirect_uri = f"{settings.CORS_ALLOWED_ORIGINS.split(',')[0]}/integrations/callback"

        if platform == "TIKTOK":
            client_key = os.getenv("TIKTOK_CLIENT_KEY")
            client_secret = os.getenv("TIKTOK_CLIENT_SECRET")
            
            # Exchange code for token
            token_url = "https://open.tiktokapis.com/v2/oauth/token/"
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
            data = {
                "client_key": client_key,
                "client_secret": client_secret,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": frontend_redirect_uri
            }
            
            try:
                resp = requests.post(token_url, headers=headers, data=data)
                resp_json = resp.json()
                
                if "access_token" not in resp_json:
                     return Response({"detail": f"TikTok Auth Failed: {resp_json}"}, status=status.HTTP_400_BAD_REQUEST)
                
                access_token = resp_json["access_token"]
                refresh_token = resp_json.get("refresh_token")
                open_id = resp_json.get("open_id") # User ID
                expire_in = resp_json.get("expires_in")
                
                # Fetch basic user info (handle, avatar)
                # Note: this requires a separate call usually
                
                # Update or Create ConnectedAccount
                account, created = ConnectedAccount.objects.update_or_create(
                    user=request.user,
                    platform=ConnectedAccount.Platform.TIKTOK,
                    defaults={
                        "access_token": access_token,
                        "refresh_token": refresh_token,
                        "status": ConnectedAccount.Status.VERIFIED,
                        "token_expires_at": timezone.now() + timezone.timedelta(seconds=expire_in),
                        "handle": open_id, # Temporary until we fetch real handle
                        "profile_url": f"https://tiktok.com/@{open_id}" # Placeholder
                    }
                )
                
                return Response(ConnectedAccountSerializer(account).data)

            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif platform == "INSTAGRAM":
            app_id = os.getenv("INSTAGRAM_APP_ID")
            app_secret = os.getenv("INSTAGRAM_APP_SECRET")
            
            # Exchange Facebook Login code for User Access Token
            token_url = "https://graph.facebook.com/v19.0/oauth/access_token"
            params = {
                "client_id": app_id,
                "client_secret": app_secret,
                "redirect_uri": frontend_redirect_uri,
                "code": code
            }
            
            try:
                resp = requests.get(token_url, params=params)
                resp_json = resp.json()
                
                if "access_token" not in resp_json:
                    return Response({"detail": f"Instagram/Facebook Auth Failed: {resp_json}"}, status=status.HTTP_400_BAD_REQUEST)
                    
                access_token = resp_json["access_token"]
                # Expires in ~60 days usually for long lived, or we can exchange standard token for long-lived.
                # Standard FB user token is short-lived (1 hour). We should ideally exchange it.
                # But for now, we'll store it.
                
                # We do NOT get a user_id directly that maps to Instagram. We get a Facebook User ID.
                # We need to find the connected Instagram Business ID to be useful.
                # But for the ConnectedAccount model, we can store the FB User ID or just a placeholder.
                
                account, created = ConnectedAccount.objects.update_or_create(
                    user=request.user,
                    platform=ConnectedAccount.Platform.INSTAGRAM,
                    defaults={
                        "access_token": access_token,
                        "status": ConnectedAccount.Status.VERIFIED,
                        "handle": "Instagram Connected", # We could fetch real handle later
                        "profile_url": "https://instagram.com/"
                    }
                )
                return Response(ConnectedAccountSerializer(account).data)

            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": "Platform not supported"}, status=status.HTTP_400_BAD_REQUEST)

class MixpostViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """List accounts connected to Mixpost"""
        from apps.integrations.mixpost_client import MixpostClient
        client = MixpostClient()
        data = client.get_accounts()
        if isinstance(data, dict) and "error" in data:
             return Response(data, status=status.HTTP_502_BAD_GATEWAY)
        return Response(data)

    @action(detail=False, methods=["post"])
    def sync(self, request):
        """Sync Mixpost accounts to Nexus"""
        from apps.integrations.mixpost_client import MixpostClient
        from apps.integrations.models import ConnectedAccount
        
        client = MixpostClient()
        data = client.get_accounts()
        if isinstance(data, dict) and "error" in data:
             return Response(data, status=status.HTTP_502_BAD_GATEWAY)
        
        # Mixpost API returns data in 'data' key usually
        accounts_data = data.get("data", [])
        synced_accounts = []

        for acc_data in accounts_data:
            # acc_data keys: id, name, username, provider, created_at, etc.
            # We map Mixpost Provider to Nexus Platform where possible
            provider = acc_data.get("provider", "").upper()
            platform = ConnectedAccount.Platform.OTHER
            if "TIKTOK" in provider:
                platform = ConnectedAccount.Platform.TIKTOK
            elif "INSTAGRAM" in provider:
                platform = ConnectedAccount.Platform.INSTAGRAM
            elif "YOUTUBE" in provider:
                 platform = ConnectedAccount.Platform.YOUTUBE
            
            # Create or Update ConnectedAccount
            # We store the Mixpost ID in the access_token field (or a new field would be better, but re-using for now)
            # Actually, let's use the 'handle' as the unique identifier combined with platform? 
            # Or better: check if we can store the mixpost ID.
            # For this MVP, we will rely on handle + platform uniqueness.
            
            handle = acc_data.get("username") or acc_data.get("name")
            
            account, created = ConnectedAccount.objects.update_or_create(
                user=request.user,
                platform=platform,
                handle=handle,
                defaults={
                    "status": ConnectedAccount.Status.VERIFIED,
                    "profile_url": acc_data.get("image", ""), # Store image URL in profile_url for now or leave blank
                    "verification_note": f"Synced via Mixpost (ID: {acc_data.get('id')})",
                    # We might want to store the mixpost account ID to fetch analytics later
                    # Let's verify if we have a field for external ID. We don't.
                    # We will store it in 'access_token' field prefixed with 'mixpost:' to distinguish.
                    "access_token": f"mixpost:{acc_data.get('id')}" 
                }
            )
            synced_accounts.append(ConnectedAccountSerializer(account).data)

        return Response({"synced": len(synced_accounts), "accounts": synced_accounts})

    @action(detail=False, methods=["get"], url_path="analytics/(?P<id>[^/.]+)")
    def analytics(self, request, id=None):
        """Get analytics for a specific Mixpost account (by Mixpost ID)"""
        from apps.integrations.mixpost_client import MixpostClient
        client = MixpostClient()
        period = request.query_params.get("period", "7d")
        
        data = client.get_analytics(id, period)
        if isinstance(data, dict) and "error" in data:
             return Response(data, status=status.HTTP_502_BAD_GATEWAY)
        return Response(data)
