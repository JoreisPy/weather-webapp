import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import CurrentWeather from './pages/CurrentWeather';
import Charts from './pages/Charts';
import Insights from './pages/Insights';
import { WeatherProvider } from './context/WeatherContext';
import './App.css';

function App() {
  return (
    <WeatherProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<CurrentWeather />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/insights" element={<Insights />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WeatherProvider>
  );
}

export default App;
