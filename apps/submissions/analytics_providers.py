from abc import ABC, abstractmethod
import random
import os
import requests
from django.conf import settings
from urllib.parse import urlparse, parse_qs

class AnalyticsProvider(ABC):
    @abstractmethod
    def fetch_analytics(self, url, access_token=None):
        """
        Returns a dictionary with:
        {
            "views": int,
            "likes": int,
            "comments": int,
            "shares": int
        }
        """
        pass

class ManualProvider(AnalyticsProvider):
    def fetch_analytics(self, url, access_token=None):
        return {
            "views": 0,
            "likes": 0,
            "comments": 0,
            "shares": 0
        }

class StubProvider(AnalyticsProvider):
    def fetch_analytics(self, url, access_token=None):
        # Simulate growth
        return {
            "views": random.randint(100, 10000),
            "likes": random.randint(10, 1000),
            "comments": random.randint(0, 100),
            "shares": random.randint(0, 50)
        }

class YouTubeProvider(AnalyticsProvider):
    def get_video_id(self, url):
        """Extracts video ID from YouTube URL"""
        parsed = urlparse(url)
        if parsed.hostname in ['www.youtube.com', 'youtube.com']:
            if parsed.path == '/watch':
                return parse_qs(parsed.query).get('v', [None])[0]
            if parsed.path.startswith('/shorts/'):
                return parsed.path.split('/')[2]
        if parsed.hostname == 'youtu.be':
            return parsed.path[1:]
        return None

    def fetch_analytics(self, url, access_token=None):
        api_key = os.getenv('YOUTUBE_API_KEY')
        if not api_key:
            print("WARNING: YOUTUBE_API_KEY not found in env")
            return {"views": 0, "likes": 0, "comments": 0, "shares": 0}

        video_id = self.get_video_id(url)
        if not video_id:
            return {"views": 0, "likes": 0, "comments": 0, "shares": 0}

        try:
            from googleapiclient.discovery import build
            youtube = build('youtube', 'v3', developerKey=api_key)
            request = youtube.videos().list(
                part="statistics",
                id=video_id
            )
            response = request.execute()
            
            if not response['items']:
                return {"views": 0, "likes": 0, "comments": 0, "shares": 0}

            stats = response['items'][0]['statistics']
            return {
                "views": int(stats.get('viewCount', 0)),
                "likes": int(stats.get('likeCount', 0)),
                "comments": int(stats.get('commentCount', 0)),
                "shares": 0 # YouTube API doesn't provide share count publically easily
            }
        except Exception as e:
            print(f"YouTube API Error: {e}")
            return {"views": 0, "likes": 0, "comments": 0, "shares": 0}

class TikTokProvider(AnalyticsProvider):
    def fetch_analytics(self, url, access_token=None):
        if not access_token:
            print("TikTok Provider requires access_token")
            return {"views": 0, "likes": 0, "comments": 0, "shares": 0}
            
        # TODO: Implement TikTok Display API logic
        # For Phase 4, we acknowledge we need the token. The implementation 
        # details depend on the specific endpoint which usually requires video_id
        # extracted from URL + user's scoped token.
        
        # Real implementation would call: https://open.tiktokapis.com/v2/video/query/
        return {"views": 0, "likes": 0, "comments": 0, "shares": 0}

class InstagramProvider(AnalyticsProvider):
    def fetch_analytics(self, url, access_token=None):
        # Scraper removed by user request.
        # Returning 0s as we have no other free way to get metrics.
        return {
            "views": 0,
            "likes": 0,
            "comments": 0,
            "shares": 0
        }

PROVIDER_MAP = {
    "YOUTUBE": YouTubeProvider,
    "TIKTOK": TikTokProvider,
    "INSTAGRAM": InstagramProvider,
    "OTHER": StubProvider,
}

def get_provider(platform):
    provider_class = PROVIDER_MAP.get(platform, StubProvider)
    return provider_class()
