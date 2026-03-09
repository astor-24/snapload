import React from 'react';
import { motion } from 'framer-motion';
import { Play, Image as ImageIcon, Music, Eye, Heart, MessageCircle, Calendar } from 'lucide-react';

/**
 * Preview Area Component
 * Displays thumbnail and metadata of the content to be downloaded
 */
const PreviewArea = ({ preview, platform }) => {
  if (!preview) return null;

  const isVideo = preview.type === 'video' || platform === 'youtube' || platform === 'tiktok';
  const isImage = preview.type === 'image' || platform === 'google_images';

  /**
   * Format large numbers (views, likes)
   */
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  /**
   * Format duration (seconds to MM:SS)
   */
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      {/* Preview Label */}
      <h3 className="text-sm font-semibold text-ios-text-secondary mb-3 flex items-center">
        <Eye className="w-4 h-4 mr-2" />
        Preview:
      </h3>

      {/* Preview Card */}
      <div className="bg-white dark:bg-gray-700 rounded-ios overflow-hidden shadow-ios">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-600">
          {preview.thumbnail && (
            <img
              src={preview.thumbnail}
              alt={preview.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
          
          {/* Play Icon Overlay for Videos */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-ios-blue ml-1" fill="currentColor" />
              </div>
            </div>
          )}

          {/* Image Icon for Images */}
          {isImage && !preview.thumbnail && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Duration Badge */}
          {preview.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(preview.duration)}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="p-4">
          {/* Title */}
          <h4 className="font-semibold text-ios-text dark:text-white mb-2 line-clamp-2">
            {preview.title}
          </h4>

          {/* Author */}
          {preview.author && (
            <p className="text-sm text-ios-text-secondary mb-3">
              By {preview.author}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Views */}
            {preview.views !== undefined && (
              <div className="flex items-center text-ios-text-secondary">
                <Eye className="w-4 h-4 mr-1" />
                <span>{formatNumber(preview.views)}</span>
              </div>
            )}

            {/* Likes */}
            {preview.likes !== undefined && (
              <div className="flex items-center text-ios-text-secondary">
                <Heart className="w-4 h-4 mr-1" />
                <span>{formatNumber(preview.likes)}</span>
              </div>
            )}

            {/* Comments */}
            {preview.comments !== undefined && (
              <div className="flex items-center text-ios-text-secondary">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{formatNumber(preview.comments)}</span>
              </div>
            )}

            {/* Date */}
            {preview.date && (
              <div className="flex items-center text-ios-text-secondary">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{preview.date}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {preview.description && (
            <p className="text-sm text-ios-text-secondary mt-3 line-clamp-3">
              {preview.description}
            </p>
          )}

          {/* Available Formats */}
          {preview.formats && preview.formats.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-ios-text-secondary mb-2">Available formats:</p>
              <div className="flex flex-wrap gap-2">
                {preview.formats.map((format, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-ios-gray dark:bg-gray-600 text-xs rounded-lg"
                  >
                    {format.quality} • {format.size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewArea;
