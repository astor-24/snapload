import React from 'react';
import { motion } from 'framer-motion';
import { Download, Moon, Sun } from 'lucide-react';

/**
 * Header Component
 * Displays app logo, title, and dark mode toggle
 */
const Header = ({ darkMode, setDarkMode }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ios-blue to-ios-purple rounded-full mb-4 shadow-ios"
      >
        <Download className="w-10 h-10 text-white" strokeWidth={2.5} />
      </motion.div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-2 gradient-text">
        DownloadPro
      </h1>

      {/* Subtitle */}
      <p className="text-ios-text-secondary text-base sm:text-lg">
        Download Anything, Anywhere
      </p>

      {/* Dark Mode Toggle */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setDarkMode(!darkMode)}
        className="mt-4 p-3 rounded-full bg-white dark:bg-gray-700 shadow-ios-sm ios-button"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-ios-blue" />
        )}
      </motion.button>
    </motion.header>
  );
};

export default Header;
