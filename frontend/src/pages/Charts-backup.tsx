import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Legend,
  ReferenceLine,
  Brush,
} from 'recharts';
import { useWeather, ChartData } from '../context/WeatherContext';

const timeframes = [
  { key: '1hour', label: 'Last Hour', icon: '⚡', color: 'from-yellow-400 to-orange-500' },
  { key: '6hours', label: '6 Hours', icon: '🕕', color: 'from-blue-400 to-blue-600' },
  { key: '24hours', label: '24 Hours', icon: '🌅', color: 'from-purple-400 to-purple-600' },
  { key: 'month', label: 'Month', icon: '🗓️', color: 'from-green-400 to-green-600' },
  { key: 'year', label: 'Year', icon: '📅', color: 'from-pink-400 to-pink-600' },
];

const chartTypes = [
  { key: 'temperature', label: 'Temperature', icon: '🌡️', color: '#ef4444' },
  { key: 'humidity', label: 'Humidity', icon: '💧', color: '#3b82f6' },
  { key: 'pressure', label: 'Pressure', icon: '📊', color: '#8b5cf6' },
  { key: 'light', label: 'Light', icon: '☀️', color: '#f59e0b' },
  { key: 'comfort', label: 'Comfort', icon: '🌿', color: '#10b981' },
];

const Charts: React.FC = () => {
  const { fetchChartData } = useWeather();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24hours');
  const [selectedChart, setSelectedChart] = useState('temperature');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChartData(selectedTimeframe);
  }, [selectedTimeframe]);

  const loadChartData = async (timeframe: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchChartData(timeframe);
      setChartData(data);
    } catch (err) {
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  const formatXAxisLabel = (value: string) => {
    const date = new Date(value);
    switch (selectedTimeframe) {
      case '1hour':
      case '6hours':
        return format(date, 'HH:mm');
      case '24hours':
        return format(date, 'HH:mm');
      case 'month':
        return format(date, 'MM/dd');
      case 'year':
        return format(date, 'MM/yy');
      default:
        return format(date, 'HH:mm');
    }
  };

  const ModernTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-gray-900/95 backdrop-blur-xl p-4 rounded-xl shadow-2xl border border-white/10"
        >
          <p className="font-semibold text-white mb-3 text-center">
            {format(new Date(label), 'PPpp')}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-300 text-sm">{entry.name}</span>
                </div>
                <span className="text-white font-medium">
                  {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
                  {entry.name.includes('Temperature') || entry.name.includes('Dew') || entry.name.includes('Feels') ? '°C' :
                   entry.name.includes('Humidity') ? '%' :
                   entry.name.includes('Pressure') ? ' hPa' :
                   entry.name.includes('Light') ? ' lux' : ''}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const getChartConfig = () => {
    switch (selectedChart) {
      case 'temperature':
        return {
          title: 'Temperature Analysis',
          description: 'Real-time temperature trends with comfort indicators',
          icon: '🌡️',
          gradient: 'from-red-500 via-orange-500 to-yellow-500',
        };
      case 'humidity':
        return {
          title: 'Humidity & Atmospheric Pressure',
          description: 'Moisture levels and barometric pressure correlation',
          icon: '💧',
          gradient: 'from-blue-500 via-cyan-500 to-teal-500',
        };
      case 'pressure':
        return {
          title: 'Atmospheric Pressure Trends',
          description: 'Barometric pressure changes and weather prediction',
          icon: '📊',
          gradient: 'from-purple-500 via-violet-500 to-indigo-500',
        };
      case 'light':
        return {
          title: 'Light Intensity Patterns',
          description: 'Natural light cycles and seasonal variations',
          icon: '☀️',
          gradient: 'from-yellow-400 via-orange-400 to-red-400',
        };
      case 'comfort':
        return {
          title: 'Comfort Index Analysis',
          description: 'Temperature, humidity, and dew point correlation',
          icon: '🌿',
          gradient: 'from-green-400 via-emerald-400 to-teal-400',
        };
      default:
        return {
          title: 'Weather Data',
          description: 'Climate monitoring and analysis',
          icon: '📈',
          gradient: 'from-gray-400 to-gray-600',
        };
    }
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'temperature':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
              <XAxis
                dataKey="time_bucket"
                tickFormatter={formatXAxisLabel}
                stroke="#9CA3AF"
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Tooltip content={<ModernTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

              <Area
                type="monotone"
                dataKey="max_temp"
                stackId="1"
                stroke="none"
                fill="url(#tempGradient)"
                name="Temperature Range"
              />
              <Area
                type="monotone"
                dataKey="min_temp"
                stackId="1"
                stroke="none"
                fill="#ffffff"
                name=""
              />

              <Line
                type="monotone"
                dataKey="avg_temp"
                stroke="#ef4444"
                strokeWidth={4}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 3, fill: '#ffffff' }}
                name="Temperature"
              />

              <Line
                type="monotone"
                dataKey="avg_feels_like"
                stroke="#10b981"
                strokeWidth={3}
                strokeDasharray="8 4"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 7, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
                name="Feels Like"
              />

              <Brush
                dataKey="time_bucket"
                height={30}
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.1}
                tickFormatter={formatXAxisLabel}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'humidity':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
              <XAxis
                dataKey="time_bucket"
                tickFormatter={formatXAxisLabel}
                stroke="#9CA3AF"
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#3b82f6"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#3b82f6' } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#8b5cf6"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Pressure (hPa)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#8b5cf6' } }}
              />
              <Tooltip content={<ModernTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="avg_humidity"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#humidityGradient)"
                name="Humidity (%)"
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avg_pressure"
                stroke="#8b5cf6"
                strokeWidth={4}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 3, fill: '#ffffff' }}
                name="Pressure (hPa)"
              />

              <ReferenceLine yAxisId="left" y={30} stroke="#ef4444" strokeDasharray="5 5" />
              <ReferenceLine yAxisId="left" y={70} stroke="#ef4444" strokeDasharray="5 5" />

              <Brush
                dataKey="time_bucket"
                height={30}
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                tickFormatter={formatXAxisLabel}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'light':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="lightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#fde047" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
              <XAxis
                dataKey="time_bucket"
                tickFormatter={formatXAxisLabel}
                stroke="#9CA3AF"
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Light Level (lux)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Tooltip content={<ModernTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />

              <Area
                type="monotone"
                dataKey="avg_light"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#lightGradient)"
                name="Light Level (lux)"
              />

              <ReferenceLine y={100} stroke="#6b7280" strokeDasharray="3 3" />
              <ReferenceLine y={1000} stroke="#6b7280" strokeDasharray="3 3" />
              <ReferenceLine y={10000} stroke="#6b7280" strokeDasharray="3 3" />

              <Brush
                dataKey="time_bucket"
                height={30}
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.1}
                tickFormatter={formatXAxisLabel}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'comfort':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
              <XAxis
                dataKey="time_bucket"
                tickFormatter={formatXAxisLabel}
                stroke="#9CA3AF"
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Tooltip content={<ModernTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />

              <Line
                type="monotone"
                dataKey="avg_temp"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                name="Temperature"
              />
              <Line
                type="monotone"
                dataKey="avg_dew_point"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4 }}
                name="Dew Point"
              />
              <Line
                type="monotone"
                dataKey="avg_feels_like"
                stroke="#8b5cf6"
                strokeWidth={3}
                strokeDasharray="6 3"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                name="Feels Like"
              />

              <ReferenceLine y={18} stroke="#10b981" strokeDasharray="5 5" />
              <ReferenceLine y={24} stroke="#10b981" strokeDasharray="5 5" />

              <Brush
                dataKey="time_bucket"
                height={30}
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
                tickFormatter={formatXAxisLabel}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const config = getChartConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Weather Analytics
          </h1>
          <p className="text-xl text-slate-300">
            Immersive visualization of your climate data
          </p>
        </motion.div>

        {/* Timeframe Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {timeframes.map(({ key, label, icon, color }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTimeframe(key)}
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
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {chartTypes.map(({ key, label, icon, color }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedChart(key)}
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

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-96"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-purple-400/20 border-t-purple-400 rounded-full mx-auto mb-4"
                />
                <p className="text-slate-300 text-lg">Loading weather data...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-xl"
            >
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-red-400 mb-6 text-lg">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadChartData(selectedTimeframe)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chart */}
        <AnimatePresence>
          {!loading && !error && chartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Chart Header */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`text-6xl bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                      {config.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{config.title}</h2>
                      <p className="text-slate-300">{config.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{chartData.length}</div>
                    <div className="text-slate-400 text-sm">data points</div>
                  </div>
                </div>

                {/* Chart Container */}
                <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
                  {renderChart()}
                </div>
              </div>

              {/* Statistics Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {[
                  {
                    label: 'Peak Temperature',
                    value: `${Math.max(...chartData.map(d => d.avg_temp)).toFixed(1)}°C`,
                    icon: '🔥',
                    color: 'from-red-500 to-orange-500',
                  },
                  {
                    label: 'Lowest Temperature',
                    value: `${Math.min(...chartData.map(d => d.avg_temp)).toFixed(1)}°C`,
                    icon: '🧊',
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    label: 'Average Humidity',
                    value: `${(chartData.reduce((sum, d) => sum + d.avg_humidity, 0) / chartData.length).toFixed(1)}%`,
                    icon: '💧',
                    color: 'from-blue-400 to-blue-600',
                  },
                  {
                    label: 'Peak Light',
                    value: `${Math.max(...chartData.map(d => d.avg_light)).toFixed(0)} lux`,
                    icon: '☀️',
                    color: 'from-yellow-400 to-orange-400',
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl text-white shadow-2xl`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{stat.icon}</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </div>
                    </div>
                    <div className="text-white/90 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Data State */}
        <AnimatePresence>
          {!loading && !error && chartData.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <div className="text-8xl mb-6">📊</div>
              <h3 className="text-3xl font-bold text-white mb-4">No Data Available</h3>
              <p className="text-slate-400 text-lg">No weather data found for the selected timeframe.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Charts;
