# OAuth Setup Guide for Postiz

## Overview
This guide will help you set up OAuth credentials for YouTube and TikTok integration with Postiz.

## YouTube OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure consent screen if prompted:
   - User Type: External
   - App name: "Nexus"
   - Support email: your email
   - Authorized domains: `localhost`
4. Application type: **Web application**
5. Name: "Nexus YouTube Integration"
6. Authorized redirect URIs:
   ```
   http://localhost:3000/integrations/social/youtube
   ```
7. Click "Create"
8. Copy the **Client ID** and **Client Secret**

### 3. Update .env File
```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

---

## TikTok OAuth Setup

### 1. Create TikTok Developer Account
1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Sign in with your TikTok account
3. Complete the developer registration

### 2. Create an App
1. Navigate to "Manage apps"
2. Click "Create an app"
3. Fill in app details:
   - App name: "Nexus"
   - Category: "Social Media Management"
4. Submit for review (may take 1-2 business days)

### 3. Configure OAuth
Once approved:
1. Go to your app settings
2. Add redirect URI:
   ```
   http://localhost:3000/integrations/social/tiktok
   ```
3. Request the following scopes:
   - `user.info.basic`
   - `video.list`
   - `user.info.stats`
4. Copy the **Client Key** and **Client Secret**

### 4. Update .env File
```bash
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
```

---

## Restart Services
After updating `.env`:
```bash
docker-compose restart postiz
```

---

## Testing OAuth Flow

### YouTube
1. Navigate to `http://localhost:3000`
2. Go to Integrations
3. Click "Connect YouTube"
4. Authorize with your Google account
5. Verify account appears in Postiz

### TikTok
1. Navigate to `http://localhost:3000`
2. Go to Integrations
3. Click "Connect TikTok"
4. Authorize with your TikTok account
5. Verify account appears in Postiz

---

## Troubleshooting

### "Redirect URI mismatch"
- Ensure the redirect URI in Google/TikTok console EXACTLY matches:
  - YouTube: `http://localhost:3000/integrations/social/youtube`
  - TikTok: `http://localhost:3000/integrations/social/tiktok`
- No trailing slashes
- Use `http` not `https` for local development

### "Invalid client"
- Double-check Client ID/Secret in `.env`
- Restart Postiz container after updating `.env`

### TikTok "App not approved"
- TikTok requires manual app review (1-2 days)
- You cannot test until approved
- Focus on YouTube first
