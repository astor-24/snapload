import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Link2, Clipboard, Search, Check, X, Loader2, 
  Moon, Sun, Share2, Zap, Sparkles, ChevronRight, Instagram, 
  User, Plus, Trash2, Clock, Image as ImageIcon
} from 'lucide-react';
import { smartDownload, downloadImageDirect } from './utils/realDownloader';

const platforms = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵', gradient: 'from-black to-gray-700' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', gradient: 'from-red-600 to-red-500' },
  { id: 'instagram', name: 'Instagram', icon: '📸', gradient: 'from-purple-600 via-pink-500 to-orange-400' },
  { id: 'facebook', name: 'Facebook', icon: '👍', gradient: 'from-blue-600 to-blue-500' },
  { id: 'twitter', name: 'Twitter', icon: '✖️', gradient: 'from-sky-500 to-sky-400' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', gradient: 'from-red-600 to-red-500' },
  { id: 'threads', name: 'Threads', icon: '🔗', gradient: 'from-black to-gray-600' },
  { id: 'google', name: 'Images', icon: '🖼️', gradient: 'from-blue-500 via-red-500 to-yellow-500' },
];

function App() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [recentDownloads, setRecentDownloads] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('download');
  const [igUsername, setIgUsername] = useState('');
  const [batchUrls, setBatchUrls] = useState(['']);
  const [batchDownloading, setBatchDownloading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('snapload_history');
    if (saved) setRecentDownloads(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (recentDownloads.length > 0) {
      localStorage.setItem('snapload_history', JSON.stringify(recentDownloads));
    }
  }, [recentDownloads]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const detectPlatform = (inputUrl) => {
    if (/tiktok\.com/i.test(inputUrl)) return 'tiktok';
    if (/youtube\.com|youtu\.be/i.test(inputUrl)) return 'youtube';
    if (/instagram\.com/i.test(inputUrl)) return 'instagram';
    if (/facebook\.com|fb\.watch/i.test(inputUrl)) return 'facebook';
    if (/twitter\.com|x\.com/i.test(inputUrl)) return 'twitter';
    if (/pinterest\.com/i.test(inputUrl)) return 'pinterest';
    if (/threads\.net/i.test(inputUrl)) return 'threads';
    if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(inputUrl)) return 'google';
    return '';
  };

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    setPreview(null);
    const detected = detectPlatform(newUrl);
    if (detected) setPlatform(detected);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleUrlChange(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('URL berhasil di-paste! 📋', 'success');
    } catch (error) {
      showToast('Gagal paste', 'error');
    }
  };

  const handlePreview = async () => {
    if (!url) { showToast('Masukkan URL', 'error'); return; }
    setLoading(true);
    const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i);
    setTimeout(() => {
      setPreview({
        title: isImage ? 'Image' : `Media dari ${platform}`,
        thumbnail: isImage ? url : `https://picsum.photos/640/360?r=${Date.now()}`,
        type: isImage ? 'image' : 'video',
        url: url
      });
      setLoading(false);
      showToast('Preview dimuat! ✨', 'success');
    }, 1000);
  };

  const handleDownload = async () => {
    if (!url) { showToast('Masukkan URL', 'error'); return; }
    const detectedPlatform = platform || detectPlatform(url);
    setDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(p => p >= 90 ? 90 : p + 10);
    }, 200);

    try {
      const result = await smartDownload(url, detectedPlatform);
      clearInterval(interval);
      setDownloadProgress(100);
      
      const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i);
      setRecentDownloads(prev => [{
        id: Date.now(),
        platform: detectedPlatform || 'direct',
        thumbnail: isImage ? url : `https://picsum.photos/100?r=${Date.now()}`,
        timestamp: new Date().toISOString(),
        url
      }, ...prev.slice(0, 11)]);
      
      showToast(result.message, 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setTimeout(() => { setDownloading(false); setDownloadProgress(0); }, 1000);
    }
  };

  const handleLoadStories = () => {
    if (!igUsername.trim()) { showToast('Masukkan username', 'error'); return; }
    window.open(`https://snapinsta.app/story/${igUsername}`, '_blank');
    showToast('Membuka halaman stories...', 'success');
  };

  const addBatchUrl = () => setBatchUrls([...batchUrls, '']);
  const removeBatchUrl = (i) => setBatchUrls(batchUrls.filter((_, idx) => idx !== i));
  const updateBatchUrl = (i, v) => { const n = [...batchUrls]; n[i] = v; setBatchUrls(n); };

  const handleBatchDownload = async () => {
    const valid = batchUrls.filter(u => u.trim());
    if (!valid.length) { showToast('Masukkan URL', 'error'); return; }
    setBatchDownloading(true);
    for (const u of valid) {
      try { await downloadImageDirect(u); } catch (e) { console.log(e); }
      await new Promise(r => setTimeout(r, 500));
    }
    setBatchDownloading(false);
    showToast('Batch download selesai!', 'success');
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: 'Snapload', url: window.location.href });
    else { navigator.clipboard.writeText(window.location.href); showToast('Link disalin!', 'success'); }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'}`}>
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        
        {/* Header */}
        <header className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl animate-pulse opacity-50 blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-black">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">SNAPLOAD</span>
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>⚡ Download Cepat • Tanpa Watermark • HD</p>
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white'}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={handleShare} className={`p-3 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-white'}`}>
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className={`flex rounded-2xl p-1.5 mb-6 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} shadow-lg`}>
          {[{ id: 'download', label: 'Download', icon: Download }, { id: 'stories', label: 'IG Stories', icon: Instagram }, { id: 'batch', label: 'Batch', icon: ImageIcon }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <tab.icon className="w-4 h-4" /><span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Download Tab */}
        {activeTab === 'download' && (
          <div className={`rounded-3xl shadow-2xl p-6 mb-6 ${darkMode ? 'bg-gray-800/70' : 'bg-white/80'}`}>
            <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              <Link2 className="w-4 h-4 inline mr-2" />Paste URL
            </label>
            <div className={`flex items-center rounded-2xl p-1 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} focus-within:ring-2 focus-within:ring-blue-500`}>
              <input type="text" value={url} onChange={e => handleUrlChange(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePreview()}
                placeholder="https://..." className={`flex-1 bg-transparent px-4 py-3.5 outline-none ${darkMode ? 'text-white' : 'text-gray-800'}`} />
              <button onClick={handlePaste} className={`p-3 rounded-xl mx-1 ${copied ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-600' : 'bg-white shadow-sm'}`}>
                {copied ? <Check className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}
              </button>
              <button onClick={handlePreview} disabled={loading || !url}
                className={`p-3 rounded-xl mr-1 ${url && !loading ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-300'}`}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-6">
              {platforms.map(p => (
                <button key={p.id} onClick={() => setPlatform(p.id)}
                  className={`p-3 rounded-2xl transition-all ${platform === p.id ? `bg-gradient-to-br ${p.gradient} text-white shadow-lg scale-105` : darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100'}`}>
                  <div className="text-2xl mb-1">{p.icon}</div>
                  <div className="text-[10px] font-bold truncate">{p.name}</div>
                </button>
              ))}
            </div>

            {preview && (
              <div className={`mt-6 rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <img src={preview.thumbnail} alt="Preview" className="w-full aspect-video object-cover" />
                <div className="p-4">
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{preview.title}</p>
                  <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{url}</p>
                </div>
              </div>
            )}

            <button onClick={handleDownload} disabled={downloading || !url}
              className={`w-full mt-6 py-4 rounded-2xl font-bold text-white shadow-xl ${downloading ? 'bg-gray-500' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'}`}>
              {downloading ? <><Loader2 className="w-5 h-5 inline animate-spin mr-2" />Downloading {Math.round(downloadProgress)}%...</> 
                : <><Download className="w-5 h-5 inline mr-2" />Download Sekarang<ChevronRight className="w-5 h-5 inline ml-2" /></>}
            </button>
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className={`rounded-3xl shadow-2xl p-6 mb-6 ${darkMode ? 'bg-gray-800/70' : 'bg-white/80'}`}>
            <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              <User className="w-4 h-4 inline mr-2" />Username Instagram
            </label>
            <div className="flex gap-2">
              <input type="text" value={igUsername} onChange={e => setIgUsername(e.target.value)} placeholder="username"
                className={`flex-1 px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
              <button onClick={handleLoadStories} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold">
                <Search className="w-5 h-5" />
              </button>
            </div>
            <p className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kamu akan diarahkan ke halaman download stories.</p>
          </div>
        )}

        {/* Batch Tab */}
        {activeTab === 'batch' && (
          <div className={`rounded-3xl shadow-2xl p-6 mb-6 ${darkMode ? 'bg-gray-800/70' : 'bg-white/80'}`}>
            <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              <ImageIcon className="w-4 h-4 inline mr-2" />Batch Download Gambar
            </label>
            <div className="space-y-2 mb-4">
              {batchUrls.map((u, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={u} onChange={e => updateBatchUrl(i, e.target.value)} placeholder={`URL ${i + 1}`}
                    className={`flex-1 px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                  {batchUrls.length > 1 && <button onClick={() => removeBatchUrl(i)} className="p-3 bg-red-500 text-white rounded-xl"><Trash2 className="w-5 h-5" /></button>}
                </div>
              ))}
            </div>
            <button onClick={addBatchUrl} className={`w-full py-3 rounded-xl font-bold mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Plus className="w-5 h-5 inline mr-2" />Tambah URL
            </button>
            <button onClick={handleBatchDownload} disabled={batchDownloading}
              className={`w-full py-4 rounded-2xl font-bold text-white ${batchDownloading ? 'bg-gray-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
              {batchDownloading ? <><Loader2 className="w-5 h-5 inline animate-spin mr-2" />Downloading...</> : <><Download className="w-5 h-5 inline mr-2" />Download Semua</>}
            </button>
          </div>
        )}

        {/* Recent */}
        {recentDownloads.length > 0 && (
          <div className={`rounded-3xl shadow-2xl p-6 ${darkMode ? 'bg-gray-800/70' : 'bg-white/80'}`}>
            <div className="flex items-center gap-2 mb-4"><Clock className="w-5 h-5" /><h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Riwayat</h3></div>
            <div className="grid grid-cols-4 gap-3">
              {recentDownloads.slice(0, 8).map(item => (
                <div key={item.id} className="aspect-square rounded-2xl overflow-hidden">
                  <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4">
            <div className={`rounded-2xl p-4 flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white shadow-2xl`}>
              {toast.type === 'success' ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
              <p className="flex-1 font-semibold text-sm">{toast.message}</p>
              <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
