import React from 'react';
import { motion } from 'framer-motion';

const ChartLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="relative">
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-purple-400/20 border-t-purple-400 rounded-full mx-auto"
          />
          {/* Inner ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-2 left-2 w-16 h-16 border-4 border-blue-400/20 border-b-blue-400 rounded-full"
          />
          {/* Center dot */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-8 left-8 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
          />
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6"
        >
          <p className="text-slate-300 text-lg font-medium">Loading weather data...</p>
          <p className="text-slate-500 text-sm mt-2">Analyzing climate patterns</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChartLoading;
