const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const BACKEND_URL = isDevelopment 
  ? "http://127.0.0.1:10000" 
  : "https://aichatapp3-0.onrender.com/"; // Update with your actual backend URL from Render