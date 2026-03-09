import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import requests
import tempfile
from urllib.parse import urlparse, unquote
import re

app = Flask(__name__)

# CORS - Allow dari frontend
CORS(app, origins=[
    "http://localhost:5173",
    "https://*.netlify.app",
    "https://*.render.com"
])

def detect_platform(url):
    """Auto-detect platform from URL"""
    platforms = {
        'tiktok.com': 'tiktok',
        'youtube.com': 'youtube',
        'youtu.be': 'youtube',
        'instagram.com': 'instagram',
        'facebook.com': 'facebook',
        'fb.watch': 'facebook',
        'twitter.com': 'twitter',
        'x.com': 'twitter',
        'pinterest.com': 'pinterest',
        'googleusercontent.com': 'google_images',
        'gstatic.com': 'google_images'
    }
    
    for domain, platform in platforms.items():
        if domain in url.lower():
            return platform
    return None

@app.route('/api/detect', methods=['POST'])
def detect():
    """Detect platform from URL"""
    try:
        data = request.json
        url = data.get('url', '')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        platform = detect_platform(url)
        
        if not platform:
            return jsonify({'error': 'Unsupported platform'}), 400
        
        return jsonify({
            'platform': platform,
            'url': url
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/preview', methods=['POST'])
def preview():
    """Get preview/info about the content"""
    try:
        data = request.json
        url = data.get('url', '')
        platform = data.get('platform', '')
        
        if not url:
            return jsonify({'error': 'URL required'}), 400
        
        # Use yt-dlp untuk most platforms
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            return jsonify({
                'title': info.get('title', 'Untitled'),
                'thumbnail': info.get('thumbnail', ''),
                'duration': info.get('duration', 0),
                'author': info.get('uploader', 'Unknown'),
                'views': info.get('view_count', 0),
                'likes': info.get('like_count', 0),
                'description': info.get('description', '')[:200],
                'type': 'video' if info.get('duration') else 'image',
                'formats': [
                    {'quality': '1080p', 'size': 'HD'},
                    {'quality': '720p', 'size': 'SD'},
                ]
            })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download():
    """Download content"""
    try:
        data = request.json
        url = data.get('url', '')
        quality = data.get('quality', '1080p')
        audio_only = data.get('audioOnly', False)
        
        if not url:
            return jsonify({'error': 'URL required'}), 400
        
        # Setup yt-dlp
        temp_dir = tempfile.gettempdir()
        
        if audio_only:
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '320',
                }],
            }
        else:
            quality_map = {
                '4k': 'bestvideo[height<=2160]+bestaudio/best',
                '1080p': 'bestvideo[height<=1080]+bestaudio/best',
                '720p': 'bestvideo[height<=720]+bestaudio/best',
                '480p': 'bestvideo[height<=480]+bestaudio/best',
            }
            
            ydl_opts = {
                'format': quality_map.get(quality, quality_map['1080p']),
                'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
                'merge_output_format': 'mp4',
            }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            if audio_only:
                filename = filename.rsplit('.', 1)[0] + '.mp3'
            
            if os.path.exists(filename):
                return send_file(
                    filename,
                    as_attachment=True,
                    download_name=os.path.basename(filename)
                )
            else:
                return jsonify({'error': 'Download failed'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)s
