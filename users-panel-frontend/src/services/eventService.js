import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create an axios instance for the admin backend
const adminBackendAPI = axios.create({
  baseURL: 'http://localhost:5000', // Your admin backend port
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 8000 // Add timeout to prevent long waiting
});

// Add response interceptor to handle common errors
adminBackendAPI.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('Backend connection error: MongoDB Compass might not be running or server is down');
      // Only show toast once to avoid spamming the user
      if (!window.hasShownConnectionError) {
        toast.error('Cannot connect to the database. Please make sure MongoDB Compass is running.');
        window.hasShownConnectionError = true;
      }
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Function to fetch all public events
export const fetchPublicEvents = async () => {
  try {
    const response = await adminBackendAPI.get('/api/events');
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Function to fetch upcoming events
export const fetchUpcomingEvents = async () => {
  try {
    const response = await adminBackendAPI.get('/events/get-upcoming');
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

// Function to fetch past events
export const fetchPastEvents = async () => {
  try {
    const response = await adminBackendAPI.get('/events/get-past');
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching past events:', error);
    return [];
  }
};

// Function to fetch registered events for a user
export const fetchMyEvents = async () => {
  try {
    const response = await adminBackendAPI.get('/events/my-events');
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching my events:', error);
    return [];
  }
};