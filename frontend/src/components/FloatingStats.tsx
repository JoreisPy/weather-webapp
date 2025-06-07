import React from 'react';
import { motion } from 'framer-motion';
import { ChartData } from '../context/WeatherContext';

interface FloatingStatsProps {
  data: ChartData[];
  selectedTimeframe: string;
}

const FloatingStats: React.FC<FloatingStatsProps> = ({ data, selectedTimeframe }) => {
  if (!data || data.length === 0) return null;

  const stats = {
    tempRange: {
      max: Math.max(...data.map(d => d.avg_temp)),
      min: Math.min(...data.map(d => d.avg_temp)),
      avg: data.reduce((sum, d) => sum + d.avg_temp, 0) / data.length,
    },
    humidity: {
      avg: data.reduce((sum, d) => sum + d.avg_humidity, 0) / data.length,
      max: Math.max(...data.map(d => d.avg_humidity)),
    },
    pressure: {
      avg: data.reduce((sum, d) => sum + d.avg_pressure, 0) / data.length,
      trend: data.length > 1 ? data[data.length - 1].avg_pressure - data[0].avg_pressure : 0,
    },
    light: {
      max: Math.max(...data.map(d => d.avg_light)),
      avg: data.reduce((sum, d) => sum + d.avg_light, 0) / data.length,
    }
  };

  const getTimeframeLabel = () => {
    switch (selectedTimeframe) {
      case '1hour': return 'Last Hour';
      case '6hours': return 'Last 6 Hours';
      case '24hours': return 'Last 24 Hours';
      case 'month': return 'Last Month';
      case 'year': return 'Last Year';
      default: return 'Selected Period';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-10 space-y-4"
    >
      {/* Main Stats Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4 w-64"
      >
        <div className="text-center mb-4">
          <h3 className="text-white font-semibold text-lg">{getTimeframeLabel()}</h3>
          <p className="text-slate-400 text-sm">{data.length} data points</p>
        </div>

        <div className="space-y-3">
          {/* Temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🌡️</span>
              <span className="text-slate-300 text-sm">Temperature</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{stats.tempRange.avg.toFixed(1)}°C</div>
              <div className="text-slate-500 text-xs">
                {stats.tempRange.min.toFixed(1)}° - {stats.tempRange.max.toFixed(1)}°
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">💧</span>
              <span className="text-slate-300 text-sm">Humidity</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{stats.humidity.avg.toFixed(1)}%</div>
              <div className="text-slate-500 text-xs">Max: {stats.humidity.max.toFixed(1)}%</div>
            </div>
          </div>

          {/* Pressure */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📊</span>
              <span className="text-slate-300 text-sm">Pressure</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{stats.pressure.avg.toFixed(1)} hPa</div>
              <div className={`text-xs ${stats.pressure.trend > 0 ? 'text-green-400' : stats.pressure.trend < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                {stats.pressure.trend > 0 ? '↗' : stats.pressure.trend < 0 ? '↘' : '→'} {Math.abs(stats.pressure.trend).toFixed(1)}
              </div>
            </div>
          </div>

          {/* Light */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">☀️</span>
              <span className="text-slate-300 text-sm">Light</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{stats.light.avg.toFixed(0)} lux</div>
              <div className="text-slate-500 text-xs">Peak: {stats.light.max.toFixed(0)}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weather Insights */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-4 w-64"
      >
        <div className="text-center mb-3">
          <h4 className="text-white font-medium">Weather Insights</h4>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🌡️</span>
            <span className="text-slate-300">
              {stats.tempRange.avg > 25 ? 'Warm conditions' :
               stats.tempRange.avg > 15 ? 'Comfortable temperature' :
               'Cool conditions'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg">💧</span>
            <span className="text-slate-300">
              {stats.humidity.avg > 70 ? 'High humidity' :
               stats.humidity.avg > 30 ? 'Comfortable humidity' :
               'Low humidity'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg">🌪️</span>
            <span className="text-slate-300">
              {Math.abs(stats.pressure.trend) > 5 ? 'Pressure changing rapidly' :
               Math.abs(stats.pressure.trend) > 2 ? 'Moderate pressure change' :
               'Stable pressure'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FloatingStats;
