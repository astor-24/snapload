import React from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';

/**
 * Download Button Component
 * Primary action button with loading state
 */
const DownloadButton = ({ onClick, loading, quality, audioOnly }) => {
  const buttonText = audioOnly
    ? 'Download Audio (320kbps)'
    : `Download ${quality.toUpperCase()}`;

  return (
    <motion.button
      whileTap={{ scale: loading ? 1 : 0.97 }}
      onClick={onClick}
      disabled={loading}
      className={`w-full py-4 rounded-ios font-semibold text-white text-base transition-all duration-300 ios-button ${
        loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-ios-blue to-ios-purple hover:shadow-ios-sm'
      }`}
    >
      <div className="flex items-center justify-center">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            <span>{buttonText}</span>
          </>
        )}
      </div>
    </motion.button>
  );
};

export default DownloadButton;
