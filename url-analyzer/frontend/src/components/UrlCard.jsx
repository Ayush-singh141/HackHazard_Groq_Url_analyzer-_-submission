import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cardRevealAnimation } from '../utils/animations';
import { useToast } from '../context/ToastContext';
import { deleteUrl } from '../utils/api';
import axios from 'axios';

const API_URL = 'https://hackhazard-groq-url-analyzer.onrender.com/api';

const UrlCard = ({ url, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const cardRef = useRef(null);
  const toast = useToast();
  
  // Apply card animation when component mounts
  useEffect(() => {
    if (cardRef.current) {
      cardRevealAnimation(cardRef.current);
    }
  }, []);
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Truncate text to specified length
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  // Handle URL deletion with a direct axios call as a fallback
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDeleting) {
      console.log("Already processing delete request");
      return;
    }
    
    try {
      console.log("Delete button clicked for URL:", url._id);
      setIsDeleting(true);
      toast.info('Deleting URL...');
      
      // Get token directly from localStorage for this critical operation
      const token = localStorage.getItem('token');
      console.log(`Token exists: ${token ? 'yes' : 'no'}${token ? ' (starts with: ' + token.substring(0, 10) + '...)' : ''}`);
      
      // Try the parent callback first
      let deleteSuccessful = false;
      
      if (typeof onDelete === 'function') {
        try {
          console.log("Calling parent onDelete function");
          const result = await onDelete(url._id);
          console.log("Parent onDelete result:", result);
          deleteSuccessful = result === true;
        } catch (err) {
          console.error("Parent callback error:", err);
        }
      }
      
      // If parent callback failed or doesn't exist, try direct API call
      if (!deleteSuccessful) {
        console.log("Making direct delete API call");
        
        // First try with our utility function
        const result = await deleteUrl(url._id);
        console.log("API utility result:", result);
        
        if (!result.success) {
          // As a fallback, try with direct axios call
          console.log("API utility failed, trying direct axios call");
          
          if (!token) {
            throw new Error('No authentication token available');
          }
          
          const finalUrl = `${API_URL}/urls/${url._id}`;
          console.log("Direct axios DELETE to:", finalUrl);
          
          const response = await axios({
            method: 'DELETE',
            url: finalUrl,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          });
          
          console.log("Direct axios response:", response.status, response.statusText);
          console.log("Response data:", response.data);
          
          if (response.status === 200) {
            deleteSuccessful = true;
          }
        } else {
          deleteSuccessful = true;
        }
      }
      
      if (deleteSuccessful) {
        console.log("Delete successful");
        toast.success('URL deleted successfully');
        
        // Attempt to remove the card from DOM directly
        if (cardRef.current) {
          console.log("Removing card from DOM");
          cardRef.current.style.display = 'none';
        }
        
        // Force dashboard refresh after a small delay to ensure server consistency
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error("Delete failed after all attempts");
        toast.error('Error deleting URL. Please try again later.');
      }
    } catch (error) {
      console.error("Exception during deletion:", error);
      
      // Check for auth errors in the caught exception
      if (error.response?.status === 401 || error.response?.status === 403 || 
          error.message?.includes('token') || error.message?.includes('auth')) {
        console.log("Auth error detected, redirecting to login");
        toast.error('Your session has expired. Please log in again.');
        
        // Clear token and redirect to login
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/login?redirect=dashboard&refreshed=true';
        }, 1500);
      } else {
        toast.error('Failed to delete URL: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
      style={{ opacity: 0 }} // Initial state for animation
    >
      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors shadow-lg border-2 border-red-400 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-70"
        aria-label="Delete URL"
        disabled={isDeleting}
      >
        {isDeleting ? (
          // Loading spinner (fully white)
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          // Delete icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
      </button>
  

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate pr-12">
          {url.title.slice(0, 50) || 'Untitled Website'}
        </h3>
        
        <p className="text-sm text-gray-500 mb-3 truncate">
          {url.originalUrl}
        </p>
        
        <p className="text-sm text-gray-600 mb-4">
          {truncateText(url.summary || 'No description available')}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {formatDate(url.createdAt)}
          </span>
          
          <Link 
            to={`/chat/${url._id}`}
            className="btn-primary text-sm py-1 px-3"
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UrlCard; 