import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);
  const colOneRef = useRef(null);
  const colTwoRef = useRef(null);
  const colThreeRef = useRef(null);
  const copyrightRef = useRef(null);
  const socialLinksRef = useRef(null);

  // Apply animations when component mounts and when it becomes visible
  useEffect(() => {
    // Set up intersection observer to detect when footer is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('Footer visible, starting animations');
          setIsVisible(true);
          observer.disconnect(); // Only need to trigger once
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of footer is visible
    
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    
    // Set up social icon hover effects
    if (socialLinksRef.current) {
      const icons = socialLinksRef.current.querySelectorAll('svg');
      
      icons.forEach(icon => {
        const parent = icon.parentElement;
        
        if (parent) {
          parent.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2)';
            icon.style.transition = 'transform 0.3s ease';
          });
          
          parent.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1)';
            icon.style.transition = 'transform 0.3s ease';
          });
        }
      });
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer 
      ref={footerRef}
      className={`bg-gray-900 text-white py-8 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            ref={colOneRef}
            className={isVisible ? 'animate-fadeInUp delay-100' : 'hidden-ready'}
          >
            <h3 className="text-xl font-bold mb-4 hover-scale">URL Analyzer</h3>
            <p className="text-gray-400 mb-4">
              Powerful web content analysis with GROQ AI integration. Analyze any URL and chat with AI about its content. <br />
              Created with love by Code Crusaders.
            </p>
            <div ref={socialLinksRef} className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400  transition-colors">
                <svg className="w-6 h-6 hover-scale" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 transition-colors">
                <svg className="w-6 h-6 hover-scale" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div 
            ref={colTwoRef}
            className={isVisible ? 'animate-fadeInUp delay-200' : 'hidden-ready'}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li className={isVisible ? 'animate-fadeInLeft delay-300' : 'hidden-ready'}>
                <Link to="/" className="text-gray-300 transition-colors pb-1 border-b border-transparent hover:text-gray-600">Home</Link>
              </li>
              <li className={isVisible ? 'animate-fadeInLeft delay-400' : 'hidden-ready'}>
                <Link to="/analyze" className="text-gray-300 hover:text-gray-600 transition-colors pb-1 border-b border-transparent ">Analyze URL</Link>
              </li>
              <li className={isVisible ? 'animate-fadeInLeft delay-500' : 'hidden-ready'}>
                <Link to="/login" className="text-gray-300 hover:text-gray-600 transition-colors pb-1 border-b border-transparent">Login</Link>
              </li>
              <li className={isVisible ? 'animate-fadeInLeft delay-500' : 'hidden-ready'}>
                <Link to="/register" className="text-gray-300 hover:text-gray-600 transition-colors pb-1 border-b border-transparent">Sign Up</Link>
              </li>
            </ul>
          </div>
          
          <div 
            ref={colThreeRef}
            className={isVisible ? 'animate-fadeInUp delay-300' : 'hidden-ready'}
          >
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 mb-2">Have questions or suggestions?</p>
            <a 
              href="mailto:info@urlanalyzer.com" 
              className="text-blue-300 hover:text-blue-600 transition-colors pb-1 border-b border-transparent inline-block"
            >
             info.urlanalyzer@gmail.com
            </a>
          </div>
        </div>
        
        <div 
          ref={copyrightRef}
          className={`border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 ${isVisible ? 'animate-fadeIn delay-500' : 'hidden-ready'}`}
        >
          <p>&copy; {new Date().getFullYear()} URL Analyzer with GROQ AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 