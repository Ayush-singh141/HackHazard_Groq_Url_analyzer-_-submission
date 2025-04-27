import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import UrlInput from '../components/UrlInput';

const AnalyzePage = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  
  // Set up animations on component mount
  useEffect(() => {
    const timeline = gsap.timeline();
    
    timeline
      .from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      })
      .from(descriptionRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.3');
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen py-16 md:py-24 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 
              ref={titleRef} 
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            >
              Analyze Any Website
            </h1>
            <p 
              ref={descriptionRef}
              className="text-lg text-gray-600"
            >
              Paste a URL below to analyze its content and start chatting with GROQ AI
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Enter a URL to analyze</h2>
            <UrlInput autoFocus={true} />
            
            <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">What happens next?</h3>
              <ol className="list-decimal list-inside text-gray-600 space-y-2">
                <li>We'll fetch and analyze the content of the provided URL</li>
                <li>The system will extract key information, headings, and content</li>
                <li>You'll be redirected to a chat page where you can ask questions about the URL</li>
                <li>GROQ AI will answer your questions based on the analyzed content</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-primary">
              <h3 className="font-semibold mb-2">Fast Analysis</h3>
              <p className="text-gray-600 text-sm">
                Get instant insights about any webpage through our efficient analysis system
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-secondary">
              <h3 className="font-semibold mb-2">AI-Powered Chat</h3>
              <p className="text-gray-600 text-sm">
                Chat with GROQ AI about the content to deepen your understanding
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-green-500">
              <h3 className="font-semibold mb-2">Save & Revisit</h3>
              <p className="text-gray-600 text-sm">
                Create an account to save your analyses and chat history for future reference
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage; 