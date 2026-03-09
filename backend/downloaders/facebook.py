import yt_dlp
import os
import tempfile

def download_facebook(url, quality='1080p', preview_only=False):
    """
    Download Facebook video
    """
    try:
        ydl_opts = {
            'format': 'best',
            'outtmpl': os.path.join(tempfile.gettempdir(), 'facebook_%(id)s.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
        }
        
        if preview_only:
            ydl_opts['skip_download'] = True
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=not preview_only)
            
            if preview_only:
                return {
                    'title': info.get('title', 'Facebook Video'),
                    'thumbnail': info.get('thumbnail', ''),
                    'duration': info.get('duration', 0),
                    'description': info.get('description', ''),
                    'formats': [
                        {'quality': '1080p', 'size': 'HD'},
                        {'quality': '720p', 'size': 'SD'},
                    ]
                }
            
            filename = ydl.prepare_filename(info)
            return filename
    
    except Exception as e:
        raise Exception(f"Facebook download error: {str(e)}")
