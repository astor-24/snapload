import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Search, Clipboard } from 'lucide-react';

/**
 * URL Input Component
 * Input field for pasting URLs with auto-detect and preview functionality
 */
const URLInput = ({ url, onChange, onPreview, loading }) => {
  const [focused, setFocused] = useState(false);

  /**
   * Paste from clipboard
   */
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  /**
   * Handle enter key press
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && url && !loading) {
      onPreview();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6"
    >
      {/* Input Container */}
      <div
        className={`relative flex items-center bg-ios-gray dark:bg-gray-700 rounded-ios p-4 transition-all duration-300 ${
          focused ? 'ring-2 ring-ios-blue shadow-ios-sm' : ''
        }`}
      >
        {/* Icon */}
        <Link2 className="w-5 h-5 text-ios-text-secondary mr-3 flex-shrink-0" />

        {/* Input Field */}
        <input
          type="text"
          value={url}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyPress={handleKeyPress}
          placeholder="Paste URL here..."
          className="flex-1 bg-transparent outline-none text-ios-text dark:text-white placeholder-ios-text-secondary text-base"
          disabled={loading}
        />

        {/* Paste Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePaste}
          className="ml-2 p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors ios-button"
          aria-label="Paste from clipboard"
          disabled={loading}
        >
          <Clipboard className="w-5 h-5 text-ios-blue" />
        </motion.button>

        {/* Preview Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onPreview}
          disabled={!url || loading}
          className={`ml-2 p-2 rounded-lg transition-colors ios-button ${
            url && !loading
              ? 'bg-ios-blue hover:bg-blue-600 text-white'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Preview content"
        >
          <Search className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-ios-text-secondary mt-2 ml-1">
        Supports: TikTok, YouTube, Instagram, Facebook, Twitter, Pinterest, Google Images
      </p>
    </motion.div>
  );
};

export default URLInput;
