import React, { useState } from 'react';
import WeatherInput from './components/WeatherInput';
import WeatherResponse from './components/WeatherResponse';
import { queryWeather } from './services/api';
import './App.css';

function App() {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleWeatherQuery = async (query) => {
    setIsLoading(true);
    setResponse(null);

    try {
      const result = await queryWeather(query);
      setResponse(result);
    } catch (error) {
      setResponse({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">
            <span className="weather-icon">🌦️</span>
            Weather Query Assistant
          </h1>
          <p className="app-subtitle">
            Ask me anything about weather conditions in any city
          </p>
        </header>

        <main className="app-main">
          <WeatherInput 
            onSubmit={handleWeatherQuery} 
            isLoading={isLoading} 
          />
          
          <WeatherResponse 
            response={response} 
            isLoading={isLoading} 
          />
        </main>
      </div>
    </div>
  );
}

export default App;
