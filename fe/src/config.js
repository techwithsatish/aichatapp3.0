const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Backend port - check your be/.env file for the PORT value
export const BACKEND_URL = isDevelopment 
  ? "http://127.0.0.1:7000" 
  : "https://aichatapp3-0.onrender.com"; // Remove trailing slash