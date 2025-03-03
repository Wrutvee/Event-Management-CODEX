import axios from 'axios';
import { toast } from 'react-hot-toast';

const baseURL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:3001/api';

const eventAPI = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 8000
});

// Add response interceptor
eventAPI.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('Backend connection error:', error);
      toast.error('Cannot connect to the server. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Fetch all events initially
export const fetchAllEvents = async () => {
  try {
    const response = await eventAPI.get('/events/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

// Load more events for a specific category
export const loadMoreEvents = async (category, page = 2, limit = 10) => {
  try {
    const response = await eventAPI.get(`/events/${category}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error(`Error loading more ${category} events:`, error);
    throw error;
  }
};

// Function to fetch all public events
export const fetchPublicEvents = async () => {
  try {
    const response = await eventAPI.get('/api/events');
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Function to fetch upcoming events
export const fetchUpcomingEvents = async () => {
  try {
    const response = await eventAPI.get('/events/get-upcoming');
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

// Function to fetch past events
export const fetchPastEvents = async () => {
  try {
    const response = await eventAPI.get('/events/get-past');
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching past events:', error);
    return [];
  }
};

// Function to fetch registered events for a user
export const fetchMyEvents = async () => {
  try {
    const response = await eventAPI.get('/events/my-events');
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching my events:', error);
    return [];
  }
};