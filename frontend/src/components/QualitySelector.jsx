import React from 'react';
import { motion } from 'framer-motion';
import { Video, Music } from 'lucide-react';

/**
 * Quality options based on platform
 */
const qualityOptions = {
  youtube: [
    { value: '4k', label: '4K', sublabel: '2160p' },
    { value: '1080p', label: 'Full HD', sublabel: '1080p' },
    { value: '720p', label: 'HD', sublabel: '720p' },
  ],
  default: [
    { value: '1080p', label: 'Full HD', sublabel: '1080p' },
    { value: '720p', label: 'HD', sublabel: '720p' },
  ],
};

/**
 * Quality Selector Component
 * Radio buttons for selecting download quality
 */
const QualitySelector = ({ quality, audioOnly, onQualityChange, onAudioOnlyChange, platform }) => {
  const options = qualityOptions[platform] || qualityOptions.default;
  const showAudioOption = ['youtube', 'tiktok', 'facebook', 'twitter'].includes(platform);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      {/* Header */}
      <div className="flex items-center mb-3">
        <Video className="w-4 h-4 text-ios-text-secondary mr-2" />
        <h3 className="text-sm font-semibold text-ios-text-secondary">
          Download Quality:
        </h3>
      </div>

      {/* Quality Options */}
      <div className="bg-ios-gray dark:bg-gray-700 rounded-ios p-4 space-y-3">
        {/* Video Quality Options */}
        {!audioOnly && options.map((option) => (
          <label
            key={option.value}
            className="flex items-center cursor-pointer group"
          >
            <input
              type="radio"
              name="quality"
              value={option.value}
              checked={quality === option.value}
              onChange={(e) => onQualityChange(e.target.value)}
              className="w-5 h-5 text-ios-blue focus:ring-ios-blue focus:ring-2"
            />
            <div className="ml-3 flex-1">
              <div className="text-sm font-medium text-ios-text dark:text-white group-hover:text-ios-blue transition-colors">
                {option.label}
              </div>
              <div className="text-xs text-ios-text-secondary">
                {option.sublabel}
              </div>
            </div>
            {quality === option.value && (
              <motion.div
                layoutId="quality-check"
                className="w-2 h-2 bg-ios-blue rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </label>
        ))}

        {/* Audio Only Option */}
        {showAudioOption && (
          <>
            <div className="border-t border-gray-300 dark:border-gray-600 my-2" />
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={audioOnly}
                onChange={(e) => onAudioOnlyChange(e.target.checked)}
                className="w-5 h-5 text-ios-blue rounded focus:ring-ios-blue focus:ring-2"
              />
              <div className="ml-3 flex items-center flex-1">
                <Music className="w-4 h-4 text-ios-purple mr-2" />
                <div>
                  <div className="text-sm font-medium text-ios-text dark:text-white group-hover:text-ios-purple transition-colors">
                    Audio Only
                  </div>
                  <div className="text-xs text-ios-text-secondary">
                    320kbps MP3
                  </div>
                </div>
              </div>
              {audioOnly && (
                <motion.div
                  layoutId="audio-check"
                  className="w-2 h-2 bg-ios-purple rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </label>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default QualitySelector;
