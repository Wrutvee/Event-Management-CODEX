import React from 'react';
import { HelpCircle, Calendar, Award, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function PlusMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  
  const handleNavigation = (path) => {
    try {
      navigate(path);
      onClose(); // Close the menu after navigation
    } catch (error) {
      toast.error('Navigation failed. Please try again.');
    }
  };
  
  // Create separate arrays for link items and button items
  const linkItems = [
    {
      icon: <Award className="h-5 w-5" />,
      label: 'Certificates',
      to: '/certificates',
      color: 'bg-green-500 hover:bg-green-600',
      ariaLabel: 'View certificates'
    }
  ];
  
  const menuItems = [
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: 'Help & Support',
      onClick: () => {
        // This will be handled by the parent component
        document.dispatchEvent(new CustomEvent('openHelpMenu'));
        onClose();
      },
      color: 'bg-green-500 hover:bg-green-600',
      ariaLabel: 'Open help and support'
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'My Calendar',
      onClick: () => handleNavigation('/calendar'),
      color: 'bg-blue-500 hover:bg-blue-600',
      ariaLabel: 'View calendar'
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      onClick: () => handleNavigation('/settings'),
      color: 'bg-gray-500 hover:bg-gray-600',
      ariaLabel: 'Open settings'
    }
  ];
  
  return (
    <div 
      className={`fixed bottom-20 right-6 flex flex-col-reverse items-center space-y-reverse space-y-2 transition-all duration-300 z-50 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="plus-menu-button"
    >
      {/* Regular menu items */}
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`${item.color} text-white p-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 flex items-center group relative`}
          style={{ 
            transitionDelay: `${index * 50}ms`,
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'scale(1)' : 'scale(0.5)'
          }}
          aria-label={item.ariaLabel}
          role="menuitem"
        >
          {item.icon}
          <span className="sr-only">{item.label}</span>
          <div className="absolute right-full mr-2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {item.label}
          </div>
        </button>
      ))}
      
      {/* Link Items */}
      {linkItems.map((item, index) => (
        <Link
          key={index}
          to={item.to}
          className={`${item.color} text-white p-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 flex items-center group relative focus:outline-none focus:ring-0`}
          style={{ 
            transitionDelay: `${(menuItems.length + index) * 50}ms`,
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'scale(1)' : 'scale(0.5)'
          }}
          aria-label={item.ariaLabel}
          role="menuitem"
        >
          {item.icon}
          <span className="sr-only">{item.label}</span>
          <div className="absolute right-full mr-2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {item.label}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PlusMenu;
