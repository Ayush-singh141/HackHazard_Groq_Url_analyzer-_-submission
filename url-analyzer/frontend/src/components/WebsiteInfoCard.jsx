import { useRef, useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { cardRevealAnimation, expandSectionAnimation } from '../utils/animations';

const WebsiteInfoCard = ({ urlData, isLoading }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const cardRef = useRef(null);
  const metaSectionRef = useRef(null);
  const headingsSectionRef = useRef(null);
  const contentSectionRef = useRef(null);
  
  const sectionAnimations = useRef({
    meta: null,
    headings: null,
    content: null
  });

  // Initial card reveal animation
  useEffect(() => {
    if (cardRef.current) {
      cardRevealAnimation(cardRef.current);
    }
  }, [isLoading, urlData]);
  
  // Setup section animations
  useEffect(() => {
    // Initialize section animations
    sectionAnimations.current = {
      meta: expandSectionAnimation(null, metaSectionRef.current),
      headings: expandSectionAnimation(null, headingsSectionRef.current),
      content: expandSectionAnimation(null, contentSectionRef.current)
    };
  }, [urlData]);
  
  // Handle section expansion
  useEffect(() => {
    // Stop all animations first
    Object.values(sectionAnimations.current).forEach(animation => {
      if (animation) animation.pause().progress(0);
    });
    
    // Play the selected section animation
    if (expandedSection && sectionAnimations.current[expandedSection]) {
      sectionAnimations.current[expandedSection].play();
    }
  }, [expandedSection]);

  // Toggle section expansion
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  if (isLoading) {
    return (
      <div 
        ref={cardRef}
        className="bg-white rounded-xl shadow-md p-6 h-full flex justify-center items-center"
        style={{ opacity: 0 }}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!urlData) {
    return (
      <div 
        ref={cardRef}
        className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col justify-center items-center text-gray-500"
        style={{ opacity: 0 }}
      >
        <svg
          className="w-16 h-16 mb-4"
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
        <p className="text-center">No website data available</p>
      </div>
    );
  }

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-xl shadow-md p-6 h-full overflow-y-auto"
      style={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {urlData.title.slice(0, 50) || 'Untitled Website'}
        </h2>
        <a 
          href={urlData.originalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-words"
        >
          {urlData.originalUrl}
        </a>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Summary
        </h3>
        <p className="text-gray-600">
          {urlData.summary || 'No summary available'}
        </p>
      </div>

      {/* Meta Information */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('meta')}
        >
          <h3 className="text-lg font-semibold text-gray-700">Meta Information</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedSection === 'meta' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div 
          ref={metaSectionRef}
          className="mt-3 space-y-2 text-sm text-gray-600 border-l-2 border-gray-200 pl-4 overflow-hidden"
          style={{ 
            opacity: expandedSection === 'meta' ? 1 : 0,
            height: expandedSection === 'meta' ? 'auto' : '0',
            display: expandedSection === 'meta' ? 'block' : 'none'
          }}
        >
          {urlData.metadata && urlData.metadata.description && (
            <div>
              <span className="font-medium">Description:</span> {urlData.metadata.description}
            </div>
          )}
          {urlData.metadata && urlData.metadata.ogTitle && (
            <div>
              <span className="font-medium">OG Title:</span> {urlData.metadata.ogTitle}
            </div>
          )}
          {urlData.metadata && urlData.metadata.ogDescription && (
            <div>
              <span className="font-medium">OG Description:</span> {urlData.metadata.ogDescription}
            </div>
          )}
          {urlData.metadata && urlData.metadata.ogImage && (
            <div>
              <span className="font-medium">OG Image:</span> {urlData.metadata.ogImage}
            </div>
          )}
          {(!urlData.metadata || 
            (!urlData.metadata.description && 
             !urlData.metadata.ogTitle && 
             !urlData.metadata.ogDescription && 
             !urlData.metadata.ogImage)) && (
            <div className="text-gray-500 italic">No meta information available</div>
          )}
        </div>
      </div>

      {/* Headings */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('headings')}
        >
          <h3 className="text-lg font-semibold text-gray-700">Page Structure</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedSection === 'headings' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div 
          ref={headingsSectionRef}
          className="mt-3 space-y-1 text-sm text-gray-600 border-l-2 border-gray-200 pl-4 overflow-hidden"
          style={{ 
            opacity: expandedSection === 'headings' ? 1 : 0,
            height: expandedSection === 'headings' ? 'auto' : '0',
            display: expandedSection === 'headings' ? 'block' : 'none'
          }}
        >
          {urlData.headings && urlData.headings.length > 0 ? (
            <ul>
              {urlData.headings.map((heading, index) => (
                <li key={index} className="truncate">{heading}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No headings found</p>
          )}
        </div>
      </div>

      {/* Content Preview */}
      <div>
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('content')}
        >
          <h3 className="text-lg font-semibold text-gray-700">Content Preview</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedSection === 'content' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div 
          ref={contentSectionRef}
          className="mt-3 text-sm text-gray-600 border-l-2 border-gray-200 pl-4 max-h-60 overflow-y-auto overflow-hidden"
          style={{ 
            opacity: expandedSection === 'content' ? 1 : 0,
            height: expandedSection === 'content' ? 'auto' : '0',
            display: expandedSection === 'content' ? 'block' : 'none'
          }}
        >
          {urlData.content ? (
            <p>{urlData.content}</p>
          ) : (
            <p className="text-gray-500 italic">No content available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteInfoCard; 