import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

export interface WeatherData {
  id: number;
  temperature: number;
  humidity: number;
  pressure: number;
  light: number;
  timestamp: string;
  dew_point: number;
  feels_like: number;
}

export interface ChartData {
  time_bucket: string;
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  avg_humidity: number;
  avg_pressure: number;
  avg_light: number;
  avg_dew_point: number;
  avg_feels_like: number;
}

export interface InsightsData {
  records: {
    max_temp: number;
    min_temp: number;
    max_humidity: number;
    min_humidity: number;
    max_pressure: number;
    min_pressure: number;
    max_light: number;
    min_light: number;
  };
  today: {
    avg_temp_today: number;
    max_temp_today: number;
    min_temp_today: number;
    avg_humidity_today: number;
  };
  temperature_trend: {
    recent_avg: number;
    previous_avg: number;
    temp_change: number;
  };
  seasonal_patterns: Array<{
    month: number;
    avg_temp: number;
    avg_humidity: number;
    avg_pressure: number;
  }>;
  daily_patterns: Array<{
    hour: number;
    avg_temp: number;
    avg_light: number;
  }>;
  correlations: {
    temperature_humidity: number;
    temperature_pressure: number;
  };
  data_quality: {
    total_readings: number;
    missing_temp: number;
    missing_humidity: number;
    last_reading: string;
    first_reading: string;
  };
}

interface WeatherContextType {
  currentWeather: WeatherData | null;
  loading: boolean;
  error: string | null;
  fetchCurrentWeather: () => Promise<void>;
  fetchChartData: (timeframe: string) => Promise<ChartData[]>;
  fetchInsights: () => Promise<InsightsData>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Determine API base URL based on current location
const getApiBaseUrl = () => {
  if (window.location.port === '8080') {
    // We're accessing via Nginx on port 8080, so API calls should go to same origin
    return '';
  } else {
    // We're on development port 3000, so use direct backend
    return 'http://localhost:8000';
  }
};

const API_BASE_URL = getApiBaseUrl();

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/current`);
      setCurrentWeather(response.data);
    } catch (err) {
      setError('Failed to fetch current weather data');
      console.error('Error fetching current weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (timeframe: string): Promise<ChartData[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/charts/${timeframe}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching chart data:', err);
      throw new Error('Failed to fetch chart data');
    }
  };

  const fetchInsights = async (): Promise<InsightsData> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/insights`);
      return response.data;
    } catch (err) {
      console.error('Error fetching insights:', err);
      throw new Error('Failed to fetch insights data');
    }
  };

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchCurrentWeather();

    // Refresh every 30 seconds
    const interval = setInterval(fetchCurrentWeather, 30000);

    return () => clearInterval(interval);
  }, []);

  const value: WeatherContextType = {
    currentWeather,
    loading,
    error,
    fetchCurrentWeather,
    fetchChartData,
    fetchInsights,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
