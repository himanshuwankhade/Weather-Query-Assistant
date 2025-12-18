import React, { useState } from 'react';
import './WeatherInput.css';

const WeatherInput = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }
    
    setError('');
    onSubmit(query);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="weather-input-container">
      <form onSubmit={handleSubmit} className="weather-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Ask me about weather... (e.g., What's the weather in Pune?)"
            className="weather-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default WeatherInput;
