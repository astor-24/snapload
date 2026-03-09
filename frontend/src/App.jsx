import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Download, 
  Link2, 
  Clipboard, 
  Search, 
  Check, 
  X, 
  Loader2, 
  Play,
  Music,
  Image as ImageIcon,
  Video,
  Clock,
  Heart,
  Eye,
  MessageCircle,
  Moon,
  Sun,
  Share2,
  Zap,
  Sparkles,
  ChevronRight,
  Instagram,
  User,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Platform data
const platforms = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵', gradient: 'from-[#010101] to-[#69C9D0]' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', gradient: 'from-[#FF0000] to-[#CC0000]' },
  { id: 'instagram', name: 'Instagram', icon: '📸', gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#F77737]' },
  { id: 'facebook', name: 'Facebook', icon: '👍', gradient: 'from-[#1877F2] to-[#0C5DC7]' },
  { id: 'twitter', name: 'Twitter/X', icon: '✖️', gradient: 'from-[#1DA1F2] to-[#0C85D0]' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', gradient: 'from-[#E60023] to-[#BD001A]' },
  { id: 'threads', name: 'Threads', icon: '🔗', gradient: 'from-[#000000] to-[#333333]' },
  { id: 'google', name: 'Images', icon: '🖼️', gradient: 'from-[#4285F4] via-[#EA4335] to-[#FBBC05]' },
];

// Quality options
const qualityOptions = [
  { value: '4k', label: '4K Ultra HD', sublabel: '2160p • Terbaik', icon: '👑' },
  { value: '1080p', label: 'Full HD', sublabel: '1080p • Direkomendasikan', icon: '⭐' },
  { value: '720p', label: 'HD', sublabel: '720p • Cepat', icon: '✨' },
  { value: '480p', label: 'SD', sublabel: '480p • Hemat Data', icon: '💨' },
];

function App() {
  // States
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('');
  const [quality, setQuality] = useState('1080p');
  const [audioOnly, setAudioOnly] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [recentDownloads, setRecentDownloads] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('download'); // download, stories, batch

  // Instagram Stories
  const [igUsername, setIgUsername] = useState('');
  const [igStories, setIgStories] = useState([]);
  const [selectedStories, setSelectedStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(false);

  // Batch Download
  const [batchUrls, setBatchUrls] = useState(['']);
  const [batchResults, setBatchResults] = useState([]);
  const [batchDownloading, setBatchDownloading] = useState(false);

  // Load recent downloads
  useEffect(() => {
    const saved = localStorage.getItem('snapload_history');
    if (saved) setRecentDownloads(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (recentDownloads.length > 0) {
      localStorage.setItem('snapload_history', JSON.stringify(recentDownloads));
    }
  }, [recentDownloads]);

  // Show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Detect platform
  const detectPlatform = (inputUrl) => {
    const patterns = {
      tiktok: /tiktok\.com/i,
      youtube: /youtube\.com|youtu\.be/i,
      instagram: /instagram\.com/i,
      facebook: /facebook\.com|fb\.watch|fb\.com/i,
      twitter: /twitter\.com|x\.com/i,
      pinterest: /pinterest\.com|pin\.it/i,
      threads: /threads\.net/i,
      google: /googleusercontent\.com|gstatic\.com|google\.com\/images/i,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      if (pattern.test(inputUrl)) return key;
    }
    return '';
  };

  // Handle URL change
  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    setPreview(null);
    const detected = detectPlatform(newUrl);
    if (detected) setPlatform(detected);
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleUrlChange(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('URL berhasil di-paste! 📋', 'success');
    } catch (error) {
      showToast('Gagal paste dari clipboard', 'error');
    }
  };

  // Get preview
  const handlePreview = async () => {
    if (!url) {
      showToast('Masukkan URL terlebih dahulu', 'error');
      return;
    }

    setLoading(true);
    setPreview(null);

    setTimeout(() => {
      setPreview({
        title: 'Video Viral 2024 - Konten Trending',
        thumbnail: `https://picsum.photos/640/360?random=${Date.now()}`,
        duration: 185,
        author: '@creator_keren',
        views: 2500000,
        likes: 150000,
        comments: 8500,
        type: platform === 'google' ? 'image' : 'video',
        description: 'Konten keren yang lagi viral! Download sekarang dalam kualitas HD.',
        formats: [
          { quality: '4K', size: '250MB' },
          { quality: '1080p', size: '120MB' },
          { quality: '720p', size: '65MB' },
          { quality: 'Audio', size: '8MB' },
        ]
      });
      setLoading(false);
      showToast('Preview berhasil dimuat! ✨', 'success');
    }, 1500);
  };

  // Download content
  const handleDownload = async () => {
    if (!url || !platform) {
      showToast('Masukkan URL dan pilih platform', 'error');
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      
      const newDownload = {
        id: Date.now(),
        platform,
        title: preview?.title || 'Downloaded Media',
        thumbnail: preview?.thumbnail || `https://picsum.photos/100/100?random=${Date.now()}`,
        timestamp: new Date().toISOString(),
        quality,
        type: audioOnly ? 'audio' : preview?.type || 'video'
      };
      
      setRecentDownloads(prev => [newDownload, ...prev.slice(0, 11)]);
      showToast('Download berhasil! 🎉', 'success');
      setDownloading(false);
      setDownloadProgress(0);
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = preview?.thumbnail || '';
      link.download = `snapload_${Date.now()}.${audioOnly ? 'mp3' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2500);
  };

  // ==================== INSTAGRAM STORIES ====================
  
  const handleLoadStories = async () => {
    if (!igUsername.trim()) {
      showToast('Masukkan username Instagram', 'error');
      return;
    }

    setLoadingStories(true);
    setIgStories([]);
    setSelectedStories([]);

    // Simulate loading stories
    setTimeout(() => {
      const mockStories = Array.from({ length: 8 }, (_, i) => ({
        id: `story_${i}`,
        thumbnail: `https://picsum.photos/300/533?random=${i}`,
        url: `https://picsum.photos/1080/1920?random=${i}`,
        type: i % 3 === 0 ? 'video' : 'image',
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      }));

      setIgStories(mockStories);
      setLoadingStories(false);
      showToast(`Ditemukan ${mockStories.length} stories! 📸`, 'success');
    }, 2000);
  };

  const toggleStorySelection = (storyId) => {
    setSelectedStories(prev =>
      prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const selectAllStories = () => {
    if (selectedStories.length === igStories.length) {
      setSelectedStories([]);
    } else {
      setSelectedStories(igStories.map(s => s.id));
    }
  };

  const downloadSelectedStories = async () => {
    if (selectedStories.length === 0) {
      showToast('Pilih minimal 1 story', 'error');
      return;
    }

    showToast(`Mendownload ${selectedStories.length} stories...`, 'success');

    // Simulate download
    const stories = igStories.filter(s => selectedStories.includes(s.id));
    
    for (let i = 0; i < stories.length; i++) {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = stories[i].url;
        link.download = `story_${igUsername}_${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (i === stories.length - 1) {
          showToast(`${stories.length} stories berhasil didownload! 🎉`, 'success');
        }
      }, i * 500);
    }
  };

  // ==================== BATCH DOWNLOAD ====================

  const addBatchUrl = () => {
    setBatchUrls([...batchUrls, '']);
  };

  const removeBatchUrl = (index) => {
    setBatchUrls(batchUrls.filter((_, i) => i !== index));
  };

  const updateBatchUrl = (index, value) => {
    const newUrls = [...batchUrls];
    newUrls[index] = value;
    setBatchUrls(newUrls);
  };

  const handleBatchDownload = async () => {
    const validUrls = batchUrls.filter(u => u.trim());
    
    if (validUrls.length === 0) {
      showToast('Masukkan minimal 1 URL', 'error');
      return;
    }

    setBatchDownloading(true);
    setBatchResults([]);

    // Simulate batch download
    for (let i = 0; i < validUrls.length; i++) {
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        
        setBatchResults(prev => [...prev, {
          url: validUrls[i],
          success,
          message: success ? 'Download berhasil' : 'URL tidak valid'
        }]);

        if (success) {
          // Simulate download
          const link = document.createElement('a');
          link.href = `https://picsum.photos/1080/1920?random=${i}`;
          link.download = `batch_${i + 1}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        if (i === validUrls.length - 1) {
          setBatchDownloading(false);
          const successCount = batchResults.filter(r => r.success).length + (success ? 1 : 0);
          showToast(`${successCount}/${validUrls.length} file berhasil didownload! 🎉`, 'success');
        }
      }, i * 1000);
    }
  };

  // Format functions
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} jam lalu`;
    return `${Math.floor(diffMins / 1440)} hari lalu`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Snapload - Universal Media Downloader',
          text: 'Download video dari TikTok, YouTube, Instagram & lebih banyak lagi!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link berhasil disalin!', 'success');
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'
    }`}>
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        
        {/* ==================== HEADER ==================== */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center justify-center w-24 h-24 mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl animate-pulse opacity-50 blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Zap className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </motion.div>

          <h1 className="text-4xl font-black mb-1">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              SNAPLOAD
            </span>
          </h1>

          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            ⚡ Download Cepat • Tanpa Watermark • HD Quality
          </p>

          <div className="flex justify-center gap-2 mt-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-2xl shadow-lg ${
                darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className={`p-3 rounded-2xl shadow-lg ${
                darkMode ? 'bg-gray-800 text-blue-400' : 'bg-white text-gray-700'
              }`}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* ==================== TAB NAVIGATION ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`flex rounded-2xl p-1.5 mb-6 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-lg shadow-lg`}
        >
          {[
            { id: 'download', label: 'Download', icon: Download },
            { id: 'stories', label: 'IG Stories', icon: Instagram },
            { id: 'batch', label: 'Batch', icon: ImageIcon },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* ==================== DOWNLOAD TAB ==================== */}
        <AnimatePresence mode="wait">
          {activeTab === 'download' && (
            <motion.div
              key="download-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`rounded-3xl shadow-2xl p-6 mb-6 backdrop-blur-lg ${
                darkMode 
                  ? 'bg-gray-800/70 border border-gray-700/50' 
                  : 'bg-white/80 border border-white/50'
              }`}
            >
              
              {/* URL Input */}
              <div className="mb-6">
                <label className={`block text-sm font-bold mb-3 flex items-center gap-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  <Link2 className="w-4 h-4 text-blue-500" />
                  Paste URL Video/Gambar
                </label>
                <div className={`flex items-center rounded-2xl p-1 transition-all ${
                  darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                } focus-within:ring-2 focus-within:ring-blue-500`}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePreview()}
                    placeholder="https://..."
                    className={`flex-1 bg-transparent px-4 py-3.5 outline-none text-base font-medium ${
                      darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                    }`}
                  />
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handlePaste}
                    className={`p-3 rounded-xl mx-1 transition-colors ${
                      copied 
                        ? 'bg-green-500 text-white' 
                        : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
                    }`}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handlePreview}
                    disabled={loading || !url}
                    className={`p-3 rounded-xl mr-1 ${
                      url && !loading
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : darkMode ? 'bg-gray-600 text-gray-500' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>

              {/* Platform Selector */}
              <div className="mb-6">
                <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Platform
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {platforms.map((p) => (
                    <motion.button
                      key={p.id}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPlatform(p.id)}
                      className={`relative p-3 rounded-2xl transition-all ${
                        platform === p.id
                          ? `bg-gradient-to-br ${p.gradient} text-white shadow-lg scale-105`
                          : darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.icon}</div>
                      <div className="text-[10px] font-bold truncate">{p.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Preview & Download (rest of download tab) */}
              {preview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDownload}
                    disabled={downloading}
                    className={`w-full py-4 rounded-2xl font-bold text-white text-base shadow-xl transition-all ${
                      downloading
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-2xl hover:scale-[1.02]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {downloading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Downloading {Math.round(downloadProgress)}%...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Download Sekarang</span>
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              )}

            </motion.div>
          )}

          {/* ==================== INSTAGRAM STORIES TAB ==================== */}
          {activeTab === 'stories' && (
            <motion.div
              key="stories-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`rounded-3xl shadow-2xl p-6 mb-6 backdrop-blur-lg ${
                darkMode 
                  ? 'bg-gray-800/70 border border-gray-700/50' 
                  : 'bg-white/80 border border-white/50'
              }`}
            >
              <div className="mb-6">
                <label className={`block text-sm font-bold mb-3 flex items-center gap-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  <User className="w-4 h-4 text-pink-500" />
                  Username Instagram
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={igUsername}
                    onChange={(e) => setIgUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLoadStories()}
                    placeholder="username"
                    className={`flex-1 px-4 py-3 rounded-xl ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                    } outline-none focus:ring-2 focus:ring-pink-500`}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLoadStories}
                    disabled={loadingStories}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    {loadingStories ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>

              {igStories.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {igStories.length} stories ditemukan
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={selectAllStories}
                      className="text-sm font-bold text-blue-500"
                    >
                      {selectedStories.length === igStories.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {igStories.map((story) => (
                      <motion.div
                        key={story.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleStorySelection(story.id)}
                        className={`relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer transition-all ${
                          selectedStories.includes(story.id)
                            ? 'ring-4 ring-blue-500 scale-95'
                            : 'hover:ring-2 hover:ring-gray-300'
                        }`}
                      >
                        <img src={story.thumbnail} alt="Story" className="w-full h-full object-cover" />
                        
                        {selectedStories.includes(story.id) && (
                          <div className="absolute top-2 left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}

                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded-lg text-white text-xs">
                          {story.type === 'video' ? '🎥' : '📸'}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={downloadSelectedStories}
                    disabled={selectedStories.length === 0}
                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl ${
                      selectedStories.length > 0
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      <span>Download {selectedStories.length} Stories</span>
                    </div>
                  </motion.button>
                </>
              )}
            </motion.div>
          )}

          {/* ==================== BATCH DOWNLOAD TAB ==================== */}
          {activeTab === 'batch' && (
            <motion.div
              key="batch-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`rounded-3xl shadow-2xl p-6 mb-6 backdrop-blur-lg ${
                darkMode 
                  ? 'bg-gray-800/70 border border-gray-700/50' 
                  : 'bg-white/80 border border-white/50'
              }`}
            >
              <div className="mb-4">
                <label className={`block text-sm font-bold mb-3 flex items-center gap-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  <ImageIcon className="w-4 h-4 text-green-500" />
                  Batch Download (Google Images, Pinterest, dll)
                </label>

                <div className="space-y-2 mb-4">
                  {batchUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => updateBatchUrl(index, e.target.value)}
                        placeholder={`URL ${index + 1}`}
                        className={`flex-1 px-4 py-3 rounded-xl ${
                          darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                        } outline-none focus:ring-2 focus:ring-green-500`}
                      />
                      {batchUrls.length > 1 && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeBatchUrl(index)}
                          className="p-3 bg-red-500 text-white rounded-xl"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addBatchUrl}
                  className={`w-full py-3 rounded-xl font-bold mb-4 ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>Tambah URL</span>
                  </div>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBatchDownload}
                  disabled={batchDownloading || batchUrls.filter(u => u.trim()).length === 0}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl ${
                    batchDownloading || batchUrls.filter(u => u.trim()).length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {batchDownloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download Semua ({batchUrls.filter(u => u.trim()).length})</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>

              {/* Batch Results */}
              {batchResults.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Hasil Download:
                  </h4>
                  {batchResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl flex items-center gap-3 ${
                        result.success
                          ? darkMode ? 'bg-green-900/30' : 'bg-green-50'
                          : darkMode ? 'bg-red-900/30' : 'bg-red-50'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {result.url}
                        </p>
                        <p className={`text-xs font-semibold ${
                          result.success ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Downloads (existing code) */}
        {recentDownloads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl shadow-2xl p-6 backdrop-blur-lg ${
              darkMode 
                ? 'bg-gray-800/70 border border-gray-700/50' 
                : 'bg-white/80 border border-white/50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Riwayat Download
                </h3>
              </div>
              <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {recentDownloads.length} item
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {recentDownloads.slice(0, 8).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer shadow-lg"
                >
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-[10px] font-bold truncate">{item.title}</p>
                      <p className="text-white/70 text-[9px]">{formatTimeAgo(item.timestamp)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className={`rounded-2xl shadow-2xl p-4 flex items-center gap-3 backdrop-blur-lg ${
              toast.type === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
            }`}>
              {toast.type === 'success' ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
              <p className="flex-1 font-semibold text-sm">{toast.message}</p>
              <button onClick={() => setToast(null)} className="p-1 hover:bg-white/20 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
