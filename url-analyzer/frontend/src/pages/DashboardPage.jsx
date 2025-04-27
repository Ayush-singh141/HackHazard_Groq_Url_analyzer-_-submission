import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { getUserUrls, searchUrls, deleteUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import UrlCard from '../components/UrlCard';
import LoadingSpinner from '../components/LoadingSpinner';
import UserInfoCard from '../components/UserInfoCard';
import axios from 'axios';

const API_URL = 'https://hackhazard-groq-url-analyzer.onrender.com/api';

const DashboardPage = () => {
  const [urls, setUrls] = useState([]);
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasAuthError, setHasAuthError] = useState(false);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const userCardRef = useRef(null);
  const { user, token } = useAuth();
  const toast = useToast();
  const location = useLocation();
  
  // Check for "refreshed" parameter to see if we just came from a login refresh
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('refreshed') === 'true') {
      toast.info('Authentication refreshed. You can now manage your URLs.');
      // Clean up the URL
      window.history.replaceState({}, document.title, '/dashboard');
    }
  }, [location.search, toast]);
  
  // Clear auth errors when token changes (user logged in again)
  useEffect(() => {
    if (token && hasAuthError) {
      setHasAuthError(false);
      toast.success('Authentication restored. You can now manage your URLs.');
    }
  }, [token, hasAuthError, toast]);
  
  // Check if token is valid, if not try to fetch a new one
  const verifyToken = async () => {
    try {
      // Make a simple request to verify the token
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      console.log('Token verification successful:', response.status);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };
  
  // Fetch user's URLs on mount and when user or token changes
  useEffect(() => {
    const fetchUserUrls = async () => {
      try {
        setIsLoading(true);
        
        // First verify that token is valid
        if (token) {
          const isTokenValid = await verifyToken();
          if (!isTokenValid) {
            console.error('Token verification failed, will try to refresh');
            setHasAuthError(true);
            toast.error('Your session has expired. Please log in again.');
            setTimeout(() => {
              window.location.href = '/login?redirect=dashboard&refreshed=true';
            }, 1500);
            return;
          }
        }
        
        const result = await getUserUrls();
        
        if (result.success) {
          setUrls(result.data);
          setFilteredUrls(result.data);
        } else {
          if (result.authError) {
            // Handle auth error
            setHasAuthError(true);
            toast.error('Your session has expired. Please log in again.');
            setTimeout(() => {
              window.location.href = '/login?redirect=dashboard&refreshed=true';
            }, 1500);
            return;
          }
          toast.error(result.error || 'Failed to fetch your URLs');
        }
      } catch (error) {
        console.error('Error fetching URLs:', error);
        
        // Check for auth errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          setHasAuthError(true);
          toast.error('Your session has expired. Please log in again.');
          setTimeout(() => {
            window.location.href = '/login?redirect=dashboard&refreshed=true';
          }, 1500);
          return;
        }
        
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUserUrls();
    }
  }, [toast, user, token]);
  
  // Handle URL deletion
  const handleDeleteUrl = async (urlId) => {
    try {
      console.log(`Dashboard initiating delete for URL ID: ${urlId}`);
      
      if (!urlId) {
        console.error('Invalid URL ID provided for deletion');
        toast.error('Invalid URL ID');
        return false;
      }
      
      // Verify token is valid before attempting delete
      if (!token) {
        setHasAuthError(true);
        toast.error('You need to be logged in to delete URLs');
        setTimeout(() => window.location.href = '/login?redirect=dashboard', 1500);
        return false;
      }
      
      // Show deletion feedback immediately
      toast.info('Deleting URL...');
      
      const result = await deleteUrl(urlId);
      console.log('Delete result:', result);
      
      if (result.success) {
        console.log('Delete successful, updating state');
        toast.success('URL deleted successfully');
        
        // Optimistically update UI by updating both lists
        try {
          const updatedUrls = urls.filter(url => url._id !== urlId);
          setUrls(updatedUrls);
          setFilteredUrls(filteredUrls.filter(url => url._id !== urlId));
        } catch (stateError) {
          console.error('Error updating UI state:', stateError);
          // Force a reload if state update fails
          toast.info('Refreshing dashboard...');
          setTimeout(() => window.location.reload(), 1500);
        }
        
        return true;
      } else if (result.authError) {
        // Special handling for auth errors
        setHasAuthError(true);
        toast.error('Your session has expired. Please log in again.');
        
        // Force token refresh before redirecting
        localStorage.removeItem('token');
        
        // Redirect to login page after a brief delay
        setTimeout(() => {
          window.location.href = '/login?redirect=dashboard&refreshed=true';
        }, 1500);
        return false;
      } else {
        console.error('Delete failed:', result.error);
        toast.error(result.error || 'Failed to delete URL');
        return false;
      }
    } catch (error) {
      console.error('Error in handleDeleteUrl:', error);
      toast.error('An unexpected error occurred while deleting');
      return false;
    }
  };
  
  // Apply animations on mount
  useEffect(() => {
    const timeline = gsap.timeline();
    
    if (headerRef.current && contentRef.current && userCardRef.current) {
      timeline
        .from(headerRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out'
        })
        .from(userCardRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, '-=0.2')
        .from(contentRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, '-=0.2');
    }
  }, []);
  
  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    // If search query is empty, reset the filtered URLs to the original URLs
    if (!searchQuery.trim()) {
      setFilteredUrls(urls);
      return;
    }
    
    try {
      setIsSearching(true);
      const result = await searchUrls(searchQuery);
      
      if (result.success) {
        setFilteredUrls(result.data);
        
        if (result.data.length === 0) {
          toast.info('No URLs found in your collection for this search query');
        }
      } else {
        toast.error(result.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An error occurred while searching');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredUrls(urls);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
      
        {/* Debug button for testing DELETE functionality */}
        
        
        {/* Header section */}
        <div 
          ref={headerRef}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Your Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.username || 'User'}! Manage your analyzed URLs here.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link 
              to="/analyze" 
              className="btn-primary"
            >
              Analyze New URL
            </Link>
          </div>
        </div>
        
        {/* User Info Card */}
        <div ref={userCardRef}>
          <UserInfoCard urlCount={urls.length} />
        </div>
        
        {/* Search bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your analyzed URLs..."
                className="input pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary ml-2"
              disabled={isSearching}
            >
              {isSearching ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </form>
        </div>
        
        {/* Content section */}
        <div ref={contentRef}>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No URLs Found</h2>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No results found for "${searchQuery}". Try a different search term.`
                  : "You haven't analyzed any websites yet."}
              </p>
              <Link to="/analyze" className="btn-primary">
                Analyze Your First URL
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {searchQuery
                  ? `Search Results (${filteredUrls.length})`
                  : `Your Analyzed URLs (${filteredUrls.length})`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUrls.map((url, index) => (
                  <UrlCard 
                    key={url._id} 
                    url={url} 
                    index={index} 
                    onDelete={handleDeleteUrl}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
