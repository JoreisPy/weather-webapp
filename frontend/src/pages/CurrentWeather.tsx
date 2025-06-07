import React from 'react';
import { format } from 'date-fns';
import { useWeather } from '../context/WeatherContext';

const CurrentWeather: React.FC = () => {
  const { currentWeather, loading, error, fetchCurrentWeather } = useWeather();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCurrentWeather}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentWeather) {
    return (
      <div className="text-center text-gray-500">
        No weather data available
      </div>
    );
  }

  const weatherCards = [
    {
      title: 'Temperature',
      value: `${currentWeather.temperature.toFixed(1)}°C`,
      icon: '🌡️',
      color: 'from-red-400 to-red-600',
    },
    {
      title: 'Feels Like',
      value: `${currentWeather.feels_like.toFixed(1)}°C`,
      icon: '🤔',
      color: 'from-orange-400 to-orange-600',
    },
    {
      title: 'Humidity',
      value: `${currentWeather.humidity.toFixed(1)}%`,
      icon: '💧',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Dew Point',
      value: `${currentWeather.dew_point.toFixed(1)}°C`,
      icon: '🌫️',
      color: 'from-teal-400 to-teal-600',
    },
    {
      title: 'Pressure',
      value: `${currentWeather.pressure.toFixed(1)} hPa`,
      icon: '📊',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Light',
      value: `${currentWeather.light.toFixed(0)} lux`,
      icon: '☀️',
      color: 'from-yellow-400 to-yellow-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Current Weather</h1>
        <div className="flex items-center justify-center space-x-4 text-gray-600">
          <span>{format(new Date(currentWeather.timestamp), 'PPpp')}</span>
          <button
            onClick={fetchCurrentWeather}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Weather Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherCards.map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{card.icon}</span>
              <div className="text-right">
                <p className="text-sm opacity-90">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm opacity-75">
                <span>Live Reading</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Analysis */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-600 font-medium">Comfort Level</p>
            <p className="text-gray-700">
              {currentWeather.feels_like > currentWeather.temperature + 2
                ? 'Feels warmer than actual'
                : currentWeather.feels_like < currentWeather.temperature - 2
                ? 'Feels cooler than actual'
                : 'Feels about right'}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-green-600 font-medium">Humidity Status</p>
            <p className="text-gray-700">
              {currentWeather.humidity > 70
                ? 'High humidity'
                : currentWeather.humidity < 30
                ? 'Low humidity'
                : 'Comfortable humidity'}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-yellow-600 font-medium">Light Conditions</p>
            <p className="text-gray-700">
              {currentWeather.light > 10000
                ? 'Very bright'
                : currentWeather.light > 1000
                ? 'Daylight'
                : currentWeather.light > 100
                ? 'Indoor lighting'
                : 'Low light'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
