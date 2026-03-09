import instaloader
import os
import tempfile
from datetime import datetime

# Initialize Instaloader
L = instaloader.Instaloader(
    download_videos=True,
    download_video_thumbnails=False,
    download_geotags=False,
    download_comments=False,
    save_metadata=False,
    compress_json=False,
)

def download_instagram(url, quality='1080p', preview_only=False):
    """
    Download Instagram post, reel, or IGTV
    """
    try:
        # Extract shortcode from URL
        shortcode = url.split('/')[-2] if url.endswith('/') else url.split('/')[-1]
        shortcode = shortcode.split('?')[0]
        
        post = instaloader.Post.from_shortcode(L.context, shortcode)
        
        if preview_only:
            return {
                'title': post.caption[:100] if post.caption else 'Instagram Post',
                'thumbnail': post.url,
                'author': post.owner_username,
                'likes': post.likes,
                'comments': post.comments,
                'date': post.date_utc.strftime('%Y-%m-%d'),
                'type': 'video' if post.is_video else 'image',
                'formats': [
                    {'quality': '1080p', 'size': 'Original'},
                    {'quality': '720p', 'size': 'HD'},
                ]
            }
        
        # Download to temp directory
        temp_dir = tempfile.gettempdir()
        target = os.path.join(temp_dir, f'instagram_{shortcode}')
        
        L.download_post(post, target=target)
        
        # Find the downloaded file
        files = os.listdir(temp_dir)
        for file in files:
            if shortcode in file and (file.endswith('.jpg') or file.endswith('.mp4')):
                return os.path.join(temp_dir, file)
        
        raise Exception("Download completed but file not found")
    
    except Exception as e:
        raise Exception(f"Instagram download error: {str(e)}")

def get_instagram_stories(username):
    """
    Get Instagram stories for a user
    """
    try:
        profile = instaloader.Profile.from_username(L.context, username)
        
        stories = []
        for story in L.get_stories(userids=[profile.userid]):
            for item in story.get_items():
                stories.append({
                    'id': item.mediaid,
                    'url': item.video_url if item.is_video else item.url,
                    'thumbnail': item.url,
                    'type': 'video' if item.is_video else 'image',
                    'timestamp': item.date_utc.strftime('%Y-%m-%d %H:%M:%S'),
                })
        
        return {
            'username': username,
            'stories': stories,
            'count': len(stories)
        }
    
    except Exception as e:
        raise Exception(f"Instagram stories error: {str(e)}")
