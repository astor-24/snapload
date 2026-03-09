import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

/**
 * Toast Notification Component
 * iOS-style notification that slides from top
 */
const Toast = ({ message, type = 'success', onClose }) => {
  const isSuccess = type === 'success';

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 20, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
    >
      <div className={`glass rounded-ios shadow-ios p-4 flex items-center ${
        isSuccess ? 'bg-green-50' : 'bg-red-50'
      }`}>
        {/* Icon */}
        {isSuccess ? (
          <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
        )}

        {/* Message */}
        <p className={`flex-1 text-sm font-medium ${
          isSuccess ? 'text-green-800' : 'text-red-800'
        }`}>
          {message}
        </p>

        {/* Close Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="ml-3 p-1 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
        >
          <X className={`w-5 h-5 ${
            isSuccess ? 'text-green-600' : 'text-red-600'
          }`} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Toast;
