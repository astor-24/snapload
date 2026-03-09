import yt_dlp
import requests
import os
import tempfile
from urllib.parse import urlparse

def download_pinterest(url, quality='1080p', preview_only=False):
    """
    Download Pinterest image or video
    """
    try:
        # Try video download first
        ydl_opts = {
            'format': 'best',
            'outtmpl': os.path.join(tempfile.gettempdir(), 'pinterest_%(id)s.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
        }
        
        if preview_only:
            ydl_opts['skip_download'] = True
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=not preview_only)
                
                if preview_only:
                    return {
                        'title': info.get('title', 'Pinterest Media'),
                        'thumbnail': info.get('thumbnail', ''),
                        'type': 'video',
                        'formats': [
                            {'quality': '1080p', 'size': 'HD'},
                            {'quality': '720p', 'size': 'SD'},
                        ]
                    }
                
                filename = ydl.prepare_filename(info)
                return filename
        except:
            # If video download fails, try image download
            response = requests.get(url)
            if response.status_code == 200:
                # Extract image URL from page
                # This is a simplified version - you may need to parse the HTML
                filename = os.path.join(tempfile.gettempdir(), f'pinterest_{hash(url)}.jpg')
                with open(filename, 'wb') as f:
                    f.write(response.content)
                return filename
    
    except Exception as e:
        raise Exception(f"Pinterest download error: {str(e)}")
