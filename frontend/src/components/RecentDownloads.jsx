import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Video, Music, Image as ImageIcon } from 'lucide-react';

/**
 * Recent Downloads Component
 * Grid showing recently downloaded content
 */
const RecentDownloads = ({ downloads }) => {
  /**
   * Get icon based on type
   */
  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  /**
   * Format timestamp
   */
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-ios shadow-ios p-6"
    >
      {/* Header */}
      <div className="flex items-center mb-4">
        <Clock className="w-5 h-5 text-ios-text-secondary mr-2" />
        <h3 className="font-semibold text-ios-text dark:text-white">
          Recent Downloads
        </h3>
      </div>

      {/* Downloads Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {downloads.map((download, index) => (
          <motion.div
            key={download.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * index }}
            className="group relative aspect-square rounded-ios overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer hover:shadow-ios-sm transition-all duration-200"
          >
            {/* Thumbnail */}
            {download.thumbnail ? (
              <img
                src={download.thumbnail}
                alt={download.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ios-blue to-ios-purple">
                {getTypeIcon(download.type)}
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-xs font-medium line-clamp-2 mb-1">
                  {download.title}
                </p>
                <div className="flex items-center justify-between text-white text-xs">
                  <span className="flex items-center">
                    {getTypeIcon(download.type)}
                    <span className="ml-1">{download.quality}</span>
                  </span>
                  <span>{formatTime(download.timestamp)}</span>
                </div>
              </div>
            </div>

            {/* Platform Badge */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-70 rounded text-white text-xs">
              {download.platform}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentDownloads;
