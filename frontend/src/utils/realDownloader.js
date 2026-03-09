/**
 * Real Downloader - Download media dari berbagai platform
 */

export const downloadRealMedia = async (url, platform) => {
  const services = {
    tiktok: { url: `https://ttsave.app/download?url=${encodeURIComponent(url)}`, name: 'TTSave' },
    youtube: { url: `https://ytmp3.la/Lf8w/?q=${encodeURIComponent(url)}`, name: 'YTMP3' },
    instagram: { url: `https://snapinsta.app/?url=${encodeURIComponent(url)}`, name: 'SnapInsta' },
    facebook: { url: `https://fdown.net/download.php?url=${encodeURIComponent(url)}`, name: 'FDown' },
    twitter: { url: `https://twdown.net/download.php?url=${encodeURIComponent(url)}`, name: 'TWDown' },
    pinterest: { url: `https://pinsave.app/download?url=${encodeURIComponent(url)}`, name: 'PinSave' },
  };

  const service = services[platform];
  if (service) {
    window.open(service.url, '_blank');
    return { success: true, message: `Membuka ${service.name}...` };
  }
  throw new Error('Platform tidak didukung');
};

export const downloadImageDirect = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `snapload_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true, message: 'Gambar berhasil didownload!' };
    }
  } catch (e) {
    console.log('Direct fetch failed, trying proxy');
  }

  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `snapload_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true, message: 'Gambar berhasil didownload!' };
    }
  } catch (e) {
    console.log('Proxy failed');
  }

  window.open(imageUrl, '_blank');
  return { success: true, message: 'Gambar dibuka di tab baru. Klik kanan → Save Image.' };
};

export const smartDownload = async (url, platform) => {
  const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?.*)?$/i);
  if (isImage || platform === 'google') {
    return await downloadImageDirect(url);
  }
  return await downloadRealMedia(url, platform);
};
