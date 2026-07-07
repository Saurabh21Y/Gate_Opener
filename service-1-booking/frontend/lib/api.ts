import axios from 'axios';

/**
 * Pre-configured Axios instance for the Booking backend API.
 * Base URL is set from the NEXT_PUBLIC_API_URL environment variable.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
