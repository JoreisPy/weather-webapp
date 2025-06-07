import React from 'react';
import { motion } from 'framer-motion';

interface ChartControlsProps {
  timeframes: Array<{
    key: string;
    label: string;
    icon: string;
    color: string;
  }>;
  chartTypes: Array<{
    key: string;
    label: string;
    icon: string;
    color: string;
  }>;
  selectedTimeframe: string;
  selectedChart: string;
  onTimeframeChange: (timeframe: string) => void;
  onChartTypeChange: (chartType: string) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  timeframes,
  chartTypes,
  selectedTimeframe,
  selectedChart,
  onTimeframeChange,
  onChartTypeChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {timeframes.map(({ key, label, icon, color }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTimeframeChange(key)}
            className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 ${
              selectedTimeframe === key
                ? `bg-gradient-to-r ${color} text-white shadow-2xl shadow-purple-500/25`
                : 'bg-white/10 text-slate-300 hover:bg-white/20 backdrop-blur-xl border border-white/20'
            }`}
          >
            <span className="text-2xl">{icon}</span>
            <span className="font-semibold">{label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Chart Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {chartTypes.map(({ key, label, icon, color }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChartTypeChange(key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              selectedChart === key
                ? 'bg-white/20 text-white backdrop-blur-xl border-2 border-white/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 backdrop-blur-xl border border-white/10'
            }`}
            style={{
              borderColor: selectedChart === key ? color : undefined,
              boxShadow: selectedChart === key ? `0 0 20px ${color}40` : undefined
            }}
          >
            <span className="text-lg">{icon}</span>
            <span className="font-medium text-sm">{label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default ChartControls;
