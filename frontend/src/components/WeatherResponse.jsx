import React from 'react';
import './WeatherResponse.css';

const WeatherResponse = ({ response, isLoading }) => {
  if (isLoading) {
    return (
      <div className="weather-response loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  const isError = !response.success;

  // Parse weather information from response
  const parseWeatherData = (text) => {
    if (!text) return null;

    const data = {
      location: '',
      temperature: '',
      humidity: '',
      windspeed: '',
      conditions: '',
      todayForecast: '',
      tomorrowForecast: '',
      fullForecast: ''
    };

    // Extract location (more flexible patterns)
    const locationMatch = text.match(/([A-Za-z\s]+),\s*([A-Za-z\s]+)\s+(?:Current Weather|Estimated Weather)/i);
    if (locationMatch) {
      data.location = `${locationMatch[1].trim()}, ${locationMatch[2].trim()}`;
    }

    // Extract temperature
    const tempMatch = text.match(/Temperature[:\s]+(\d+(?:\.\d+)?°[CF](?:\s*\([\d.]+°[CF]\))?)/i);
    if (tempMatch) data.temperature = tempMatch[1];

    // Extract humidity
    const humidityMatch = text.match(/Humidity[:\s]+(\d+%)/i);
    if (humidityMatch) data.humidity = humidityMatch[1];

    // Extract windspeed
    const windMatch = text.match(/Windspeed[:\s]+([\d.]+\s*(?:km\/h|mph)(?:\s*\([\d.]+\s*(?:km\/h|mph)\))?)/i);
    if (windMatch) data.windspeed = windMatch[1];

    // Extract conditions
    const conditionsMatch = text.match(/Conditions[:\s]+([A-Za-z\s]+?)(?:\n|Forecast|$)/i);
    if (conditionsMatch) data.conditions = conditionsMatch[1].trim();

    // Extract Today's forecast
    const todayMatch = text.match(/Today[:\s]+([^.]+(?:°[CF][^.]*)?\.)/i);
    if (todayMatch) data.todayForecast = todayMatch[1].trim();

    // Extract Tomorrow's forecast
    const tomorrowMatch = text.match(/Tomorrow[:\s]+([^.]+(?:°[CF][^.]*)?\.)/i);
    if (tomorrowMatch) data.tomorrowForecast = tomorrowMatch[1].trim();

    // Full forecast text (fallback)
    const forecastMatch = text.match(/Forecast[:\s]+([\s\S]+?)(?:⚠️|Please note|$)/i);
    if (forecastMatch) data.fullForecast = forecastMatch[1].trim();

    return data;
  };

  // Get weather icon based on conditions
  const getWeatherIcon = (conditions) => {
    const condition = (conditions || '').toLowerCase();
    
    if (condition.includes('sunny') || condition.includes('clear')) return '☀️';
    if (condition.includes('partly cloudy')) return '⛅';
    if (condition.includes('cloudy') || condition.includes('overcast')) return '☁️';
    if (condition.includes('rain') || condition.includes('shower')) return '🌧️';
    if (condition.includes('thunder') || condition.includes('storm')) return '⛈️';
    if (condition.includes('snow')) return '❄️';
    if (condition.includes('fog') || condition.includes('mist')) return '🌫️';
    if (condition.includes('wind')) return '💨';
    
    return '🌤️';
  };

  if (isError) {
    return (
      <div className="weather-response error">
        <div className="response-header">
          <span className="response-icon">⚠️</span>
          <h3>Unable to Process</h3>
        </div>
        <div className="response-content">
          <p>{response.message}</p>
        </div>
      </div>
    );
  }

  const weatherData = parseWeatherData(response.response);
  const weatherIcon = getWeatherIcon(weatherData?.conditions);

  // If parsing failed, show original text
  if (!weatherData || !weatherData.temperature) {
    return (
      <div className="weather-response success">
        <div className="response-content">
          <p className="weather-text">{response.response}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-response success">
      <div className="response-header">
        <span className="response-icon animated-icon">{weatherIcon}</span>
        <div className="header-text">
          {weatherData.location && <p className="location">📍 {weatherData.location}</p>}
        </div>
      </div>

      <div className="weather-grid">
        {weatherData.temperature && (
          <div className="weather-card fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-icon">🌡️</div>
            <div className="card-label">Current Temperature</div>
            <div className="card-value">{weatherData.temperature}</div>
          </div>
        )}

        {weatherData.humidity && (
          <div className="weather-card fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-icon">💧</div>
            <div className="card-label">Humidity</div>
            <div className="card-value">{weatherData.humidity}</div>
          </div>
        )}

        {weatherData.windspeed && (
          <div className="weather-card fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="card-icon">💨</div>
            <div className="card-label">Wind Speed</div>
            <div className="card-value">{weatherData.windspeed}</div>
          </div>
        )}

        {weatherData.conditions && (
          <div className="weather-card fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="card-icon">{weatherIcon}</div>
            <div className="card-label">Conditions</div>
            <div className="card-value">{weatherData.conditions}</div>
          </div>
        )}
      </div>

      {/* Today and Tomorrow Forecast Cards */}
      {(weatherData.todayForecast || weatherData.tomorrowForecast) && (
        <div className="forecast-grid fade-in-up" style={{ animationDelay: '0.5s' }}>
          {weatherData.todayForecast && (
            <div className="forecast-card today">
              <div className="forecast-card-header">
                <span className="forecast-day-icon">📅</span>
                <h4>Today</h4>
              </div>
              <p className="forecast-card-text">{weatherData.todayForecast}</p>
            </div>
          )}

          {weatherData.tomorrowForecast && (
            <div className="forecast-card tomorrow">
              <div className="forecast-card-header">
                <span className="forecast-day-icon">🗓️</span>
                <h4>Tomorrow</h4>
              </div>
              <p className="forecast-card-text">{weatherData.tomorrowForecast}</p>
            </div>
          )}
        </div>
      )}

      {/* Fallback for full forecast text if parsing failed */}
      {!weatherData.todayForecast && !weatherData.tomorrowForecast && weatherData.fullForecast && (
        <div className="forecast-section fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="forecast-header">
            <span className="forecast-icon">📅</span>
            <h4>Forecast</h4>
          </div>
          <p className="forecast-text">{weatherData.fullForecast}</p>
        </div>
      )}

      <div className="weather-footer fade-in-up" style={{ animationDelay: '0.6s' }}>
        <span className="info-icon">ℹ️</span>
        <p>Weather conditions are subject to change. For the most accurate information, please check a reliable weather source.</p>
      </div>
    </div>
  );
};

export default WeatherResponse;
