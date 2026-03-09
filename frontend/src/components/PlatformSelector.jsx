import React from 'react';
import { motion } from 'framer-motion';

/**
 * Platform Icons (SVG or Unicode)
 */
const platforms = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: 'bg-red-600' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' },
  { id: 'facebook', name: 'Facebook', icon: '👍', color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-sky-500' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', color: 'bg-red-500' },
  { id: 'google_images', name: 'Google', icon: '🖼️', color: 'bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500' },
];

/**
 * Platform Selector Component
 * Grid of platform buttons for manual selection
 */
const PlatformSelector = ({ platform, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <h3 className="text-sm font-semibold text-ios-text-secondary mb-3">
        Select Platform:
      </h3>

      {/* Platform Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {platforms.map((p, index) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * index }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(p.id)}
            className={`relative p-4 rounded-ios transition-all duration-200 ios-button ${
              platform === p.id
                ? 'bg-ios-blue text-white shadow-ios-sm'
                : 'bg-white dark:bg-gray-700 text-ios-text dark:text-white hover:shadow-ios-sm'
            }`}
          >
            {/* Icon */}
            <div className="text-3xl mb-2">{p.icon}</div>
            
            {/* Name */}
            <div className="text-xs font-medium">{p.name}</div>

            {/* Selected Indicator */}
            {platform === p.id && (
              <motion.div
                layoutId="platform-indicator"
                className="absolute inset-0 border-2 border-ios-blue rounded-ios"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PlatformSelector;
