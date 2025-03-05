import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, X, Clock, TrendingUp, Calendar } from 'lucide-react';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
    
    // Fetch trending searches
    fetchTrendingSearches();
  }, []);

  // Handle clicks outside the search component
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Fetch trending searches from the API
  const fetchTrendingSearches = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/events/trending-searches`);
      setTrendingSearches(response.data.trends || []);
    } catch (error) {
      console.error('Error fetching trending searches:', error);
      // Fallback to default trending searches if API fails
      setTrendingSearches([
        { term: 'Tech Conference', count: 120 },
        { term: 'Music Festival', count: 98 },
        { term: 'Coding Workshop', count: 75 },
        { term: 'Networking Event', count: 62 },
        { term: 'Career Fair', count: 54 }
      ]);
    }
  };
  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm || searchTerm.trim().length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }
  setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/events/search?query=${encodeURIComponent(searchTerm)}&limit=5`
        );
        
        setSuggestions(response.data.events || []);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );
  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setSuggestions([]);
    }
  };
  // Save search to recent searches
  const saveToRecentSearches = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter(item => item !== searchTerm)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };
  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (query.trim()) {
      saveToRecentSearches(query);
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setIsFocused(false);
    }
  };
  // Handle suggestion click
  const handleSuggestionClick = (eventId) => {
    navigate(`/events/${eventId}`);
    setIsFocused(false);
    setQuery('');
  };
  // Handle recent search click
  const handleRecentSearchClick = (searchTerm) => {
    setQuery(searchTerm);
    saveToRecentSearches(searchTerm);
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    setIsFocused(false);
  };
  // Handle trending search click
  const handleTrendingSearchClick = (searchTerm) => {
    setQuery(searchTerm);
    saveToRecentSearches(searchTerm);
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    setIsFocused(false);
  };
  // Clear search input
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
  };
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Calculate total items (suggestions + recent searches + trending searches)
    const totalItems = suggestions.length + 
                      (recentSearches.length > 0 ? recentSearches.length : 0) + 
                      (trendingSearches.length > 0 ? trendingSearches.length : 0);
    
    if (totalItems === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      
      // Determine which section the selected item belongs to
      if (selectedIndex < suggestions.length) {
        // It's a suggestion
        handleSuggestionClick(suggestions[selectedIndex]._id);
      } else if (selectedIndex < suggestions.length + recentSearches.length) {
        // It's a recent search
        const recentIndex = selectedIndex - suggestions.length;
        handleRecentSearchClick(recentSearches[recentIndex]);
      } else {
        // It's a trending search
        const trendingIndex = selectedIndex - suggestions.length - recentSearches.length;
        handleTrendingSearchClick(trendingSearches[trendingIndex].text);
      }
    }
  };
  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for events..."
            className="w-full h-10 pl-10 pr-10 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            aria-label="Search events"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
              ) : (
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}
        </div>
      </form>
      {/* Dropdown for suggestions */}
      {isFocused && (suggestions.length > 0 || recentSearches.length > 0 || trendingSearches.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Event suggestions */}
          {suggestions.length > 0 && (
            <div className="py-2">
              <h3 className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Events
              </h3>
              <ul>
                {suggestions.map((event, index) => (
                  <li key={event._id}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(event._id)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                        selectedIndex === index ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded overflow-hidden mr-3">
                        <img
                          src={event.image || '/images/event-placeholder.jpg'}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/event-placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(event.dateTime?.start).toLocaleDateString()}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="py-2 border-t border-gray-100">
              <h3 className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Recent Searches
              </h3>
              <ul>
                {recentSearches.map((search, index) => (
                  <li key={`recent-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleRecentSearchClick(search)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                        selectedIndex === suggestions.length + index ? 'bg-gray-100' : ''
                      }`}
                    >
                      <Clock className="h-4 w-4 text-gray-400 mr-3" />
                      <span>{search}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Trending searches */}
          {trendingSearches.length > 0 && (
            <div className="py-2 border-t border-gray-100">
              <h3 className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trending
              </h3>
              <ul>
                {trendingSearches.map((item, index) => (
                  <li key={`trending-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleTrendingSearchClick(item.text)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                        selectedIndex === suggestions.length + recentSearches.length + index ? 'bg-gray-100' : ''
                      }`}
                    >
                      <TrendingUp className="h-4 w-4 text-gray-400 mr-3" />
                      <span>{item.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* View all results button */}
          {query && (
            <div className="py-2 px-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-md transition-colors"
              >
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;