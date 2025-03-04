import React, { useState, useRef, useEffect } from 'react';
import { Search, MessageCircle, HelpCircle, X, ChevronRight, ChevronDown } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    title: 'Account & Login',
    questions: [
      { q: 'How do I create a new account?', a: 'Click on the "Sign up" link on the login page and follow the instructions to create your EventHub account.' },
      { q: 'I forgot my password. How do I reset it?', a: 'Click on the "Forgot password?" link on the login page. You\'ll receive an email with instructions to reset your password.' },
      { q: 'Why am I unable to log in?', a: 'Make sure you\'re using the correct email and password. If you still can\'t log in, try resetting your password or contact support.' }
    ]
  },
  {
    title: 'Events & Registration',
    questions: [
      { q: 'How do I register for an event?', a: 'Navigate to the event page and click the "Register" button. Follow the prompts to complete your registration.' },
      { q: 'Can I cancel my event registration?', a: 'Yes, go to "My Events" in your profile and select the event you wish to cancel. Click on "Cancel Registration".' },
      { q: 'Where can I find my event tickets?', a: 'All your event tickets can be found in the "My Events" section of your profile.' }
    ]
  },
  {
    title: 'Certificates & Rewards',
    questions: [
      { q: 'How do I get my event certificate?', a: 'After attending an event, certificates will be available in the "Certificates" section of your profile.' },
      { q: 'My certificate is not showing up', a: 'Certificates are typically issued within 24-48 hours after event completion. If it\'s been longer, please contact support.' }
    ]
  },
  {
    title: 'Security & Privacy',
    questions: [
      { q: 'How is my personal information protected?', a: 'EventHub uses industry-standard encryption to protect your data. You can review our privacy policy for more details.' },
      { q: 'Can I delete my account?', a: 'Yes, go to your profile settings and select "Delete Account". Note that this action is permanent.' }
    ]
  }
];

function HelpMenu({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showGeminiChat, setShowGeminiChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const menuRef = useRef(null);
  const chatInputRef = useRef(null);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFAQs([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    FAQ_CATEGORIES.forEach(category => {
      const matchingQuestions = category.questions.filter(
        item => item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
      );

      if (matchingQuestions.length > 0) {
        results.push({
          title: category.title,
          questions: matchingQuestions
        });
      }
    });

    setFilteredFAQs(results);
  }, [searchQuery]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Toggle category expansion
  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
    setExpandedQuestion(null);
  };

  // Toggle question expansion
  const toggleQuestion = (catIndex, qIndex) => {
    const key = `${catIndex}-${qIndex}`;
    setExpandedQuestion(expandedQuestion === key ? null : key);
  };

  // Send message to Gemini (simulated)
  const sendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const newMessages = [
      ...chatMessages,
      { sender: 'user', text: userInput }
    ];
    
    setChatMessages(newMessages);
    
    // Simulate AI response (would be replaced with actual Gemini API call)
    setTimeout(() => {
      setChatMessages([
        ...newMessages,
        { 
          sender: 'ai', 
          text: `Thanks for your question about "${userInput}". I'm Gemini, your EventHub assistant. I'm here to help with any questions about using the platform.`
        }
      ]);
    }, 1000);
    
    setUserInput('');
    
    // Focus back on input
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={onClose} />
      )}
      
      <div 
        ref={menuRef}
        className={`fixed bottom-0 inset-x-0 md:inset-x-auto md:right-4 md:bottom-4 md:w-96 bg-white rounded-t-xl md:rounded-xl shadow-2xl transition-transform duration-300 ease-in-out transform z-50 ${
          isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-8 md:opacity-0 md:pointer-events-none'
        }`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-indigo-600" />
            Help Center
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 56px)' }}>
          {!showGeminiChat ? (
            <>
              {/* Search Bar */}
              <div className="px-4 py-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Search Results or FAQ Categories */}
              <div className="px-4 py-2">
                {searchQuery.trim() !== '' ? (
                  <>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Search Results
                    </h3>
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((category, catIndex) => (
                        <div key={catIndex} className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            {category.title}
                          </h4>
                          <div className="space-y-2">
                            {category.questions.map((item, qIndex) => (
                              <div 
                                key={qIndex} 
                                className="bg-gray-50 rounded-lg overflow-hidden"
                              >
                                <button
                                  className="w-full text-left px-4 py-3 flex justify-between items-start"
                                  onClick={() => toggleQuestion(catIndex, qIndex)}
                                >
                                  <span className="text-sm font-medium text-gray-800">{item.q}</span>
                                  {expandedQuestion === `${catIndex}-${qIndex}` ? 
                                    <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                  }
                                </button>
                                {expandedQuestion === `${catIndex}-${qIndex}` && (
                                  <div className="px-4 py-3 bg-white border-t border-gray-100">
                                    <p className="text-sm text-gray-600">{item.a}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm">No results found for "{searchQuery}"</p>
                        <button
                          onClick={() => {
                            setShowGeminiChat(true);
                            setSearchQuery('');
                            setChatMessages([
                              { sender: 'ai', text: "Hello! I'm Gemini, your EventHub assistant. How can I help you today?" },
                              { sender: 'user', text: searchQuery }
                            ]);
                          }}
                          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Ask Gemini
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-3">
                      {FAQ_CATEGORIES.map((category, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            className="w-full text-left px-4 py-3 bg-gray-50 flex justify-between items-center"
                            onClick={() => toggleCategory(index)}
                          >
                            <span className="font-medium text-gray-800">{category.title}</span>
                            {expandedCategory === index ? 
                              <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            }
                          </button>
                          {expandedCategory === index && (
                            <div className="divide-y divide-gray-100">
                              {category.questions.map((item, qIndex) => (
                                <div key={qIndex}>
                                  <button
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex justify-between items-start"
                                    onClick={() => toggleQuestion(index, qIndex)}
                                  >
                                    <span className="text-sm text-gray-800">{item.q}</span>
                                    {expandedQuestion === `${index}-${qIndex}` ? 
                                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" /> : 
                                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    }
                                  </button>
                                  {expandedQuestion === `${index}-${qIndex}` && (
                                    <div className="px-4 py-3 bg-indigo-50">
                                      <p className="text-sm text-gray-600">{item.a}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Chat with Gemini Button */}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => {
                    setShowGeminiChat(true);
                    setChatMessages([
                      { sender: 'ai', text: "Hello! I'm Gemini, your EventHub assistant. How can I help you today?" }
                    ]);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat with Gemini
                </button>
                
                <div className="mt-3 text-center">
                  <a href="/contact" className="text-sm text-indigo-600 hover:text-indigo-800">
                    Need more help? Contact support
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Gemini Chat Interface */}
              <div className="flex flex-col h-full" style={{ minHeight: '400px' }}>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-3/4 rounded-lg px-4 py-2 ${
                          msg.sender === 'user' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center">
                    <input
                      type="text"
                      ref={chatInputRef}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Type your question..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none"
                      disabled={!userInput.trim()}
                    >
                      Send
                    </button>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => {
                        setShowGeminiChat(false);
                        setSearchQuery('');
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Back to Help Center
                    </button>
                    
                    <a href="/contact" className="text-sm text-indigo-600 hover:text-indigo-800">
                      Contact support
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default HelpMenu;