import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Loading State Component
 * Apple-style skeleton loading with spinner
 */
const LoadingState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mb-6"
    >
      {/* Loading Card */}
      <div className="bg-white dark:bg-gray-700 rounded-ios overflow-hidden shadow-ios">
        {/* Skeleton Thumbnail */}
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-600 overflow-hidden">
          <div className="shimmer absolute inset-0" />
          
          {/* Spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-ios-blue animate-spin" />
          </div>
        </div>

        {/* Skeleton Content */}
        <div className="p-4 space-y-3">
          {/* Title Skeleton */}
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 overflow-hidden relative">
            <div className="shimmer absolute inset-0" />
          </div>

          {/* Author Skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 overflow-hidden relative">
            <div className="shimmer absolute inset-0" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden relative">
                <div className="shimmer absolute inset-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <p className="text-center text-ios-text-secondary text-sm mt-4">
        Loading preview...
      </p>
    </motion.div>
  );
};

export default LoadingState;
