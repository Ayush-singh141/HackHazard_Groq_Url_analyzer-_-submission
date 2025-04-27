import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserInfoCard = ({ urlCount = 0 }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);
  
  // Format join date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate how long the user has been a member
  const getMemberDuration = (dateString) => {
    if (!dateString) return 'N/A';
    
    const joinDate = new Date(dateString);
    const currentDate = new Date();
    
    const diffTime = Math.abs(currentDate - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };
  
  // Generate profile color based on username
  const getProfileColor = (username) => {
    if (!username) return '#3B82F6'; // Default blue
    
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#6366F1', // Indigo
      '#14B8A6'  // Teal
    ];
    
    // Simple hash function to pick a color based on username
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-8 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row">
        {/* Profile color bar */}
        <div 
          className="w-full md:w-2 h-2 md:h-auto" 
          style={{ backgroundColor: getProfileColor(user?.username) }}
        ></div>
        
        {/* User info content */}
        <div className="p-6 flex-1">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            {/* Avatar */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 md:mb-0"
              style={{ backgroundColor: getProfileColor(user?.username) }}
            >
              {user?.username?.charAt(0)?.toUpperCase() || '?'}
            </div>
            
            {/* Basic Info */}
            <div className="md:ml-6">
              <h2 className="text-xl font-bold text-gray-800">{user?.username || 'User'}</h2>
              <p className="text-gray-600">{user?.email || 'No email available'}</p>
              <p className="text-sm text-gray-500">
                Member since {formatDate(user?.createdAt)}
                {user?.createdAt && ` · ${getMemberDuration(user?.createdAt)}`}
              </p>
            </div>
            
            {/* Toggle button for mobile */}
            <button 
              className="md:hidden ml-auto text-gray-500 hover:text-gray-700"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Show less info" : "Show more info"}
            >
              <svg 
                className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
          
          {/* Extended Info - Always visible on desktop, toggleable on mobile */}
          <div className={`mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 ${isExpanded ? 'block' : 'hidden md:grid'}`}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">URLs Analyzed</h3>
              <p className="text-lg font-semibold">{urlCount}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Plan</h3>
              <p className="text-lg font-semibold">{user?.plan || 'Free'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Account Status</h3>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <p className="text-lg font-semibold">{user?.status || 'Active'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard; 