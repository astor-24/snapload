import yt_dlp
import os
import tempfile

def download_youtube(url, quality='1080p', audio_only=False, preview_only=False):
    """
    Download YouTube video or audio
    """
    try:
        if audio_only:
            format_string = 'bestaudio[ext=m4a]/bestaudio'
            ext = 'mp3'
        else:
            quality_map = {
                '4k': 'bestvideo[height<=2160]+bestaudio/best',
                '1080p': 'bestvideo[height<=1080]+bestaudio/best',
                '720p': 'bestvideo[height<=720]+bestaudio/best',
            }
            format_string = quality_map.get(quality, quality_map['1080p'])
            ext = 'mp4'
        
        ydl_opts = {
            'format': format_string,
            'outtmpl': os.path.join(tempfile.gettempdir(), f'youtube_%(id)s.{ext}'),
            'quiet': True,
            'no_warnings': True,
        }
        
        if audio_only:
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '320',
            }]
        
        if preview_only:
            ydl_opts['skip_download'] = True
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=not preview_only)
            
            if preview_only:
                return {
                    'title': info.get('title', 'YouTube Video'),
                    'thumbnail': info.get('thumbnail', ''),
                    'duration': info.get('duration', 0),
                    'author': info.get('uploader', 'Unknown'),
                    'description': info.get('description', ''),
                    'views': info.get('view_count', 0),
                    'formats': [
                        {'quality': '4k', 'size': '2160p'},
                        {'quality': '1080p', 'size': 'Full HD'},
                        {'quality': '720p', 'size': 'HD'},
                        {'quality': 'audio', 'size': '320kbps'}
                    ]
                }
            
            filename = ydl.prepare_filename(info)
            if audio_only:
                filename = filename.rsplit('.', 1)[0] + '.mp3'
            return filename
    
    except Exception as e:
        raise Exception(f"YouTube download error: {str(e)}")
