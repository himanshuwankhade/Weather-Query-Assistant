import axios from 'axios';

const API_BASE_URL = 'https://weather-query-assistant.onrender.com/';

/**
 * Query weather information
 * @param {string} query - Weather query string
 * @returns {Promise} Response from backend
 */
export const queryWeather = async (query) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/weather`, {
      query: query.trim()
    });
    
    return response.data;
  } catch (error) {
    // Handle network or server errors
    if (error.response) {
      // Server responded with error
      return error.response.data;
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        message: 'Server is unreachable. Please make sure the backend is running.'
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }
};
