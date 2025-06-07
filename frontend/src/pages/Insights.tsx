import React from 'react';

const Insights: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather Insights</h1>
        <p className="text-gray-600">Discover patterns and analyze your weather data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Highest Temp', value: '28.5°C', color: 'from-red-400 to-red-600' },
          { title: 'Lowest Temp', value: '12.1°C', color: 'from-blue-400 to-blue-600' },
          { title: 'Max Humidity', value: '98%', color: 'from-teal-400 to-teal-600' },
          { title: 'Brightest Day', value: '45k lux', color: 'from-yellow-400 to-yellow-600' },
        ].map((record) => (
          <div
            key={record.title}
            className={`bg-gradient-to-br ${record.color} rounded-xl p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">🏆</span>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-sm opacity-90 mb-1">{record.title}</p>
            <p className="text-2xl font-bold">{record.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Data Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Readings:</span>
              <span className="font-semibold">2,737,215</span>
            </div>
            <div className="flex justify-between">
              <span>Data Since:</span>
              <span className="font-semibold">Jan 2024</span>
            </div>
            <div className="flex justify-between">
              <span>Last Reading:</span>
              <span className="font-semibold">Now</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🔗 Correlations</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Temp-Humidity:</span>
              <span className="font-semibold text-blue-600">Strong</span>
            </div>
            <div className="flex justify-between">
              <span>Temp-Pressure:</span>
              <span className="font-semibold text-green-600">Moderate</span>
            </div>
            <div className="flex justify-between">
              <span>Seasonal Patterns:</span>
              <span className="font-semibold text-purple-600">Clear</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
