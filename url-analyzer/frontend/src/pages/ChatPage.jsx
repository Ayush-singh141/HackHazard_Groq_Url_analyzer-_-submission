import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUrlById } from '../utils/api';
import { useToast } from '../context/ToastContext';
import Chat from '../components/Chat';
import WebsiteInfoCard from '../components/WebsiteInfoCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ChatPage = () => {
  const [urlData, setUrlData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { urlId } = useParams();
  const toast = useToast();

  // Fetch URL data on mount
  useEffect(() => {
    const fetchUrlData = async () => {
      try {
        setIsLoading(true);
        const result = await getUrlById(urlId);
        
        if (result.success) {
          setUrlData(result.data);
        } else {
          toast.error(result.error || 'Failed to fetch URL data');
        }
      } catch (error) {
        console.error('Error fetching URL data:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrlData();
  }, [urlId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="text-center">
          <LoadingSpinner size="xlarge" />
          <p className="mt-4 text-gray-600">Loading URL data...</p>
        </div>
      </div>
    );
  }

  if (!urlData) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background">
        <svg
          className="w-20 h-20 text-red-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">URL Not Found</h2>
        <p className="text-gray-600 mb-6">The URL you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/analyze" className="btn-primary">
          Analyze Another URL
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Chat</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6 truncate">
          {urlData.title.slice(0, 35)+'.....' || 'Chat with AI about this URL'}
        </h1>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Website info card */}
          <div className="lg:col-span-1">
            <WebsiteInfoCard urlData={urlData} isLoading={isLoading} />
          </div>
          
          {/* Chat interface */}
          <div className="lg:col-span-2 h-[calc(100vh-250px)]">
            <Chat urlId={urlId} urlData={urlData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 