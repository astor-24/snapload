import requests
import os
import tempfile
from urllib.parse import urlparse, unquote
import re

def download_google_image(url, preview_only=False):
    """
    Download image from Google Images URL
    Extract original image source and download in highest quality
    """
    try:
        # Extract actual image URL from Google's redirect URL
        actual_url = extract_image_url(url)
        
        if preview_only:
            return {
                'title': 'Google Image',
                'thumbnail': actual_url,
                'type': 'image',
                'url': actual_url,
                'formats': [
                    {'quality': 'original', 'size': 'Max Resolution'}
                ]
            }
        
        # Download the image
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(actual_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Determine file extension
        content_type = response.headers.get('content-type', '')
        ext_map = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
        }
        ext = ext_map.get(content_type, 'jpg')
        
        # Save to temp file
        filename = os.path.join(
            tempfile.gettempdir(),
            f'google_image_{hash(actual_url)}.{ext}'
        )
        
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        return filename
    
    except Exception as e:
        raise Exception(f"Google Images download error: {str(e)}")

def extract_image_url(google_url):
    """
    Extract actual image URL from Google Images URL
    """
    # Try to extract from imgurl or imgrefurl parameter
    patterns = [
        r'imgurl=([^&]+)',
        r'imgrefurl=([^&]+)',
        r'url=([^&]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, google_url)
        if match:
            return unquote(match.group(1))
    
    # If no pattern matches, assume it's already a direct URL
    return google_url
