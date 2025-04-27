import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeUrl } from '../utils/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';

const UrlInput = ({ autoFocus = false }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [animationStarted, setAnimationStarted] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Start CSS animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Validate URL format
  const validateUrl = (value) => {
    // Basic URL validation
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    
    // Only validate if there's a value
    if (value) {
      setIsValid(validateUrl(value));
    } else {
      setIsValid(true); // Empty input is considered valid
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      toast.warning('Please enter a URL');
      return;
    }
    
    if (!validateUrl(url)) {
      toast.error('Please enter a valid URL');
      setIsValid(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await analyzeUrl(url);
      
      if (result.success) {
        toast.success('URL analyzed successfully');
        
        // Create exit animation with CSS
        if (containerRef.current) {
          containerRef.current.style.animation = 'fadeInUp 0.4s ease-in forwards reverse';
          setTimeout(() => navigate(`/chat/${result.data._id}`), 400);
        } else {
          navigate(`/chat/${result.data._id}`);
        }
      } else {
        toast.error(result.error || 'Failed to analyze URL');
      }
    } catch (error) {
      console.error('Error analyzing URL:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    // Auto focus if prop is true
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-3xl mx-auto ${animationStarted ? 'animate-fadeInUp' : 'hidden-ready'}`}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="Enter a website URL (e.g., https://example.com)"
            className={`
              input pr-12 py-4 text-lg shadow-lg transition-all duration-300 hover-glow
              ${!isValid ? 'border-red-500 focus:ring-red-500' : ''}
            `}
            disabled={isLoading}
          />
          {isLoading ? (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="small" />
            </div>
          ) : (
            <button
              ref={buttonRef}
              type="submit"
              className={`
                absolute right-3 top-1/2 transform -translate-y-1/2 
                text-blue-700 hover:text-blue-900 transition-colors 
                ${url && isValid ? '' : ''}
              `}
              disabled={isLoading}
            >
              <svg
                className="w-6 h-6"
                fill="black"
                stroke="black"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          )}
        </div>
        {!isValid && (
          <p className="text-red-500 mt-2 text-sm animate-fadeIn">
            Please enter a valid URL including http:// or https://
          </p>
        )}
      </form>
    </div>
  );
};

export default UrlInput; 