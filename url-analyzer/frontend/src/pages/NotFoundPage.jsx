import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const NotFoundPage = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  
  // Apply animations on mount
  useEffect(() => {
    const timeline = gsap.timeline();
    
    if (containerRef.current && imageRef.current && contentRef.current) {
      timeline
        .from(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out'
        })
        .from(imageRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)'
        }, '-=0.3')
        .from(contentRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, '-=0.5');
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center items-center bg-background py-12 px-4"
    >
      <div className="text-center max-w-lg">
        {/* 404 Image/Icon */}
        <div ref={imageRef} className="mb-8">
          <div className="text-9xl font-bold text-primary opacity-20">404</div>
          <div className="relative -mt-24">
            <svg
              className="w-32 h-32 mx-auto text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div ref={contentRef}>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/"
              className="btn-primary"
            >
              Go Home
            </Link>
            <Link
              to="/analyze"
              className="btn-outline"
            >
              Analyze URL
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 