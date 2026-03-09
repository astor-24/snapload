import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Download, Loader2, Image as ImageIcon, Video } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Instagram Stories Component
 * Modal for viewing and downloading Instagram stories
 */
const InstagramStories = ({ onClose, showToast }) => {
  const [username, setUsername] = useState('');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStories, setSelectedStories] = useState([]);

  /**
   * Load stories for username
   */
  const handleLoadStories = async () => {
    if (!username.trim()) {
      showToast('Please enter a username', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/instagram/stories`, {
        username: username.trim()
      });

      if (response.data.stories.length === 0) {
        showToast('No stories found for this user', 'error');
      } else {
        setStories(response.data.stories);
        showToast(`Found ${response.data.stories.length} stories`, 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load stories', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle story selection
   */
  const toggleStory = (storyId) => {
    setSelectedStories(prev =>
      prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  /**
   * Select all stories
   */
  const selectAll = () => {
    if (selectedStories.length === stories.length) {
      setSelectedStories([]);
    } else {
      setSelectedStories(stories.map(s => s.id));
    }
  };

  /**
   * Download selected stories
   */
  const handleDownload = async () => {
    if (selectedStories.length === 0) {
      showToast('Please select at least one story', 'error');
      return;
    }

    const storiesToDownload = stories.filter(s => selectedStories.includes(s.id));
    
    for (const story of storiesToDownload) {
      try {
        const response = await axios.get(story.url, {
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `story_${story.id}.${story.type === 'video' ? 'mp4' : 'jpg'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download error:', error);
      }
    }

    showToast(`Downloaded ${selectedStories.length} stories`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-ios shadow-ios max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold gradient-text">Instagram Stories</h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Username Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLoadStories()}
              placeholder="Enter Instagram username..."
              className="flex-1 px-4 py-3 bg-ios-gray dark:bg-gray-700 rounded-ios outline-none focus:ring-2 focus:ring-ios-blue"
              disabled={loading}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadStories}
              disabled={loading}
              className="px-6 py-3 bg-ios-blue text-white rounded-ios font-medium ios-button disabled:bg-gray-400"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 text-ios-blue animate-spin" />
            </div>
          ) : stories.length > 0 ? (
            <>
              {/* Select All Button */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-ios-text-secondary">
                  {stories.length} stories found
                </p>
                <button
                  onClick={selectAll}
                  className="text-sm text-ios-blue font-medium"
                >
                  {selectedStories.length === stories.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stories.map((story) => (
                  <motion.div
                    key={story.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleStory(story.id)}
                    className={`relative aspect-[9/16] rounded-ios overflow-hidden cursor-pointer transition-all ${
                      selectedStories.includes(story.id)
                        ? 'ring-4 ring-ios-blue'
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                  >
                    {/* Thumbnail */}
                    <img
                      src={story.thumbnail}
                      alt="Story"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Type Badge */}
                    <div className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-70 rounded">
                      {story.type === 'video' ? (
                        <Video className="w-4 h-4 text-white" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {selectedStories.includes(story.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 left-2 w-6 h-6 bg-ios-blue rounded-full flex items-center justify-center"
                      >
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </motion.div>
                    )}

                    {/* Timestamp */}
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs bg-black bg-opacity-70 px-2 py-1 rounded">
                      {story.timestamp}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-ios-text-secondary py-12">
              <p>Enter a username to view their stories</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {stories.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              disabled={selectedStories.length === 0}
              className="w-full py-3 bg-gradient-to-r from-ios-blue to-ios-purple text-white rounded-ios font-semibold ios-button disabled:from-gray-400 disabled:to-gray-400"
            >
              <div className="flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                <span>
                  Download Selected ({selectedStories.length})
                </span>
              </div>
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InstagramStories;
