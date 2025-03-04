import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import EventPhotoSlider from '../components/event/EventPhotoSlider';
import EventTabs from '../components/event/EventTabs';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Footer from '../components/Footer';

// Sample event data (would normally come from API)
const sampleEvent = {
  _id: "event123",
  title: "Tech Innovation Summit 2023",
  description: "<p>Join us for the most anticipated tech event of the year! The Tech Innovation Summit brings together industry leaders, innovators, and tech enthusiasts for a day of learning, networking, and inspiration.</p><p>Discover the latest trends in AI, blockchain, and sustainable technology. Participate in hands-on workshops and listen to keynote speeches from renowned tech visionaries.</p>",
  coverPhoto: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
  mediaLinks: [
    { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678", type: "image" },
    { url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b", type: "image" },
    { url: "https://images.unsplash.com/photo-1591115765373-5207764f72e4", type: "image" }
  ],
  category: "Technology",
  tags: ["tech", "innovation", "networking"],
  dateTime: {
    start: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
    end: new Date(Date.now() + 86400000 * 10 + 3600000 * 8).toISOString(), // 8 hours after start
  },
  venue: {
    type: "hybrid",
    details: "Tech Convention Center & Online",
    address: "123 Innovation Drive, Silicon Valley, CA"
  },
  organizer: {
    name: "Future Tech Association",
    email: "events@futuretech.org",
    contact: "+1 (555) 123-4567"
  },
  resources: [
    { name: "Event Schedule", url: "#", type: "pdf" },
    { name: "Speaker Profiles", url: "#", type: "pdf" },
    { name: "Workshop Materials", url: "#", type: "zip" }
  ],
  team: [
    { name: "Alex Johnson", role: "Team Lead", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Sarah Chen", role: "Developer", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Miguel Rodriguez", role: "Designer", avatar: "https://randomuser.me/api/portraits/men/46.jpg" }
  ],
  tasks: [
    { id: 1, title: "Complete pre-event survey", status: "pending", dueDate: new Date(Date.now() + 86400000 * 2).toISOString() },
    { id: 2, title: "Review workshop materials", status: "pending", dueDate: new Date(Date.now() + 86400000 * 5).toISOString() },
    { id: 3, title: "Prepare project presentation", status: "pending", dueDate: new Date(Date.now() + 86400000 * 8).toISOString() }
  ],
  feedback: {
    isEnabled: true,
    questions: [
      { text: "How would you rate the event overall?", type: "star", required: true },
      { text: "What did you like most about the event?", type: "text", required: false },
      { text: "How likely are you to recommend this event to others?", type: "slider", required: true }
    ]
  },
  isRegistered: false
};

function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  
  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}`);
        // const data = await response.json();
        // if (!response.ok) throw new Error(data.message || 'Failed to fetch event');
        // setEvent(data.event);
        
        // For now, simulate API call with sample data
        setTimeout(() => {
          // Use the eventId from the URL to simulate fetching specific event
          const mockEvent = {...sampleEvent, _id: eventId};
          setEvent(mockEvent);
          setIsRegistered(mockEvent.isRegistered);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  // Handle registration
  const handleRegister = () => {
    setRegistering(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRegistered(true);
      setRegistering(false);
      toast.success("Successfully registered for the event!");
    }, 1000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, MMMM d, yyyy • h:mm a');
    } catch (error) {
      return 'Date to be announced';
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Render event not found
  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
            <p className="text-gray-700 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Return to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Header />
      
      {/* Photo Slider */}
      <EventPhotoSlider event={event} />
      
      {/* Event Title and Register Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{formatDate(event.dateTime?.start)}</span>
              <span>•</span>
              <span>
                {event.venue?.type === "online"
                  ? "Virtual Event"
                  : event.venue?.details || "Location TBD"}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleRegister}
            disabled={isRegistered || registering}
            className={`
              px-6 py-3 rounded-lg font-semibold text-white shadow-md
              transition-all duration-200 transform hover:scale-105 active:scale-95
              ${isRegistered 
                ? 'bg-green-600 cursor-default' 
                : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
          >
            {registering ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : isRegistered ? (
              'Registered'
            ) : (
              'Register Now'
            )}
          </button>
        </div>
        
        {/* Tabbed Navigation */}
        <EventTabs event={event} isRegistered={isRegistered} />
      </div>
      
      <Footer />
    </div>
  );
}

export default EventPage;