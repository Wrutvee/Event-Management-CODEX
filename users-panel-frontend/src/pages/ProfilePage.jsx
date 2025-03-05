import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
// Footer import removed
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import axiosInstance from '../services/axiosConfig';
// Updated import for default avatar
// import defaultAvatar from '../assets/default-avatar.png';

function ProfilePage() {
  const { user, updateUser, logout } = useAuth(); // Correctly destructure logout here
  const { events } = useEvents();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    interests: [],
    profilePicture: ''
  });
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      // Initialize form with user data
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        interests: user.interests || [],
        profilePicture: user.profilePicture || ''
      });
      
      // Calculate initial completion percentage
      calculateCompletionPercentage({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        interests: user.interests || [],
        profilePicture: user.profilePicture || ''
      });
    } else {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: { pathname: '/profile' } } });
    }
  }, [user, navigate]);

  // Calculate profile completion percentage
  const calculateCompletionPercentage = (data) => {
    const fields = ['name', 'email', 'phone', 'bio', 'location', 'profilePicture'];
    const interestsWeight = 1; // Weight for interests field
    
    let filledFields = 0;
    fields.forEach(field => {
      if (data[field] && data[field].trim && data[field].trim() !== '') {
        filledFields++;
      } else if (data[field] && typeof data[field] === 'object') {
        filledFields++;
      }
    });
    
    // Add weight for interests if any exist
    if (data.interests && data.interests.length > 0) {
      filledFields += interestsWeight;
    }
    
    const totalFields = fields.length + interestsWeight;
    const percentage = Math.round((filledFields / totalFields) * 100);
    setCompletionPercentage(percentage);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...profileData, [name]: value };
    setProfileData(updatedData);
    calculateCompletionPercentage(updatedData);
  };

  // Handle interests input (comma-separated)
  const handleInterestsChange = (e) => {
    const interestsString = e.target.value;
    const interestsArray = interestsString.split(',').map(item => item.trim()).filter(item => item !== '');
    const updatedData = { ...profileData, interests: interestsArray };
    setProfileData(updatedData);
    calculateCompletionPercentage(updatedData);
  };

  // Handle profile picture upload
  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      const updatedData = { ...profileData, profilePicture: reader.result };
      setProfileData(updatedData);
      calculateCompletionPercentage(updatedData);
    };
    reader.readAsDataURL(file);
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('name', profileData.name);
      formData.append('phone', profileData.phone);
      formData.append('bio', profileData.bio);
      formData.append('location', profileData.location);
      formData.append('interests', JSON.stringify(profileData.interests));
      
      // Append profile picture if it's a File object
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formData.append('profilePicture', fileInputRef.current.files[0]);
      }
      
      const response = await axiosInstance.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Update user context with new profile data
        updateUser(response.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  // Add this function to your ProfilePage component
  const handleMyEventsClick = () => {
    // Navigate to home page with tab parameter
    navigate('/?tab=my');
    // Dispatch an event to ensure the tab is selected even if already on home page
    document.dispatchEvent(new CustomEvent('switchToMyEvents'));
  };
  // Then in your JSX where the My Events button is located:
  <button 
    onClick={handleMyEventsClick}
    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
  >
    <span>My Events</span>
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
  // Navigate to Certificates page
  const handleCertificatesClick = () => {
    navigate('/certificates');
  };
  // Add this function to handle sign out
  const handleSignOut = () => {
    logout(); // Use the logout function from AuthContext
    // The redirect to login page should be handled in the logout function
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Your Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
          
          {/* Profile Completion Bar */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-medium text-indigo-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="px-6 py-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8">
              <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 cursor-pointer relative group"
                onClick={isEditing ? handleProfilePictureClick : undefined}
              >
                <img 
                  src={profileData.profilePicture || "/images/740ecb78aa4c10cb0a2170ea2350c337.jpg"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Change Photo</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              {isEditing && (
                <p className="text-xs text-gray-500 mt-2">Click on the image to upload a new photo</p>
              )}
            </div>
            
            {/* Profile Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email should not be editable
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">Interests (comma-separated)</label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={profileData.interests.join(', ')}
                  onChange={handleInterestsChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                ></textarea>
              </div>
              
              {isEditing && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Links */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600">
                <span>Registered Events: </span>
                <span className="font-medium">{events.my?.data?.length || 0}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Sign Out
                </button>
                <button
                  onClick={handleCertificatesClick}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                >
                  Certificates
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;