import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const menuRef = useRef(null);
  const navbarRef = useRef(null);
  const linksRef = useRef(null);
  const mobileMenuItemsRef = useRef([]);
  const buttonRefs = useRef([]);

  // Check for mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Start animation on mount with reduced initial delay on mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, isMobile ? 50 : 100);
    
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Handle mobile menu animation with optimizations for mobile
  useEffect(() => {
    if (!menuRef.current) return;
    
    if (isMenuOpen) {
      menuRef.current.style.display = 'flex';
      // Simpler animation for mobile
      if (isMobile) {
        menuRef.current.style.opacity = '1';
        menuRef.current.style.transform = 'translateY(0)';
      } else {
        menuRef.current.classList.add('animate-fadeInDown');
        menuRef.current.classList.remove('animate-fadeInUp');
      }
    } else if (menuRef.current.style.display === 'flex') {
      // Simpler animation for mobile
      if (isMobile) {
        menuRef.current.style.opacity = '0';
        
        // Shorter timeout for mobile
        setTimeout(() => {
          if (menuRef.current && !isMenuOpen) {
            menuRef.current.style.display = 'none';
          }
        }, 200);
      } else {
        menuRef.current.classList.remove('animate-fadeInDown');
        menuRef.current.classList.add('animate-fadeInUp');
        
        // Wait for animation to finish before hiding
        setTimeout(() => {
          if (menuRef.current && !isMenuOpen) {
            menuRef.current.style.display = 'none';
          }
        }, 300);
      }
    }
  }, [isMenuOpen, isMobile]);

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav 
      ref={navbarRef}
      className={`bg-white shadow-md py-4 sticky top-0 z-50 transition-all ${
        animationStarted ? 'animate-fadeInDown' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center hover-scale">
          <Logo />
          <span className="text-2xl font-bold text-primary hover:text-secondary">URL Analyzer</span>
        </Link>

        {/* Desktop menu */}
        <div 
          ref={linksRef} 
          className={`hidden md:flex items-center space-x-8 ${
            animationStarted ? 'animate-fadeIn' : 'opacity-0'
          }`}
        >
          <Link 
            to="/" 
            className={`text-gray-700 hover:text-primary transition-colors hover-border pb-1 ${location.pathname === '/' ? 'font-semibold text-primary' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/analyze" 
            className={`text-gray-700 hover:text-primary transition-colors hover-border pb-1 ${location.pathname === '/analyze' ? 'font-semibold text-primary' : ''}`}
          >
            Analyze URL
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`text-gray-700 hover:text-primary transition-colors hover-border pb-1 ${location.pathname === '/dashboard' ? 'font-semibold text-primary' : ''}`}
              >
                Dashboard
              </Link>
              <button 
                ref={el => { buttonRefs.current[0] = el; }}
                onClick={logout}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover-lift focus:outline-none transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                ref={el => { buttonRefs.current[1] = el; }}
                to="/login" 
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover-lift transition-all"
              >
                Login
              </Link>
              <Link 
                ref={el => { buttonRefs.current[2] = el; }}
                to="/register" 
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark hover-glow transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu - optimized for performance */}
      <div
        ref={menuRef}
        className="md:hidden flex-col items-center space-y-4 py-4 bg-white shadow-inner"
        style={{ display: 'none', transition: 'opacity 0.2s ease' }}
      >
        <div className="flex items-center justify-center mb-2">
          <Logo size="small" />
          <span className="text-lg font-semibold text-primary">URL Analyzer</span>
        </div>
        <Link 
          ref={el => { mobileMenuItemsRef.current[0] = el; }}
          to="/" 
          className={`text-gray-700 hover:text-primary transition-colors ${location.pathname === '/' ? 'font-semibold text-primary' : ''}`}
        >
          Home
        </Link>
        <Link 
          ref={el => { mobileMenuItemsRef.current[1] = el; }}
          to="/analyze" 
          className={`text-gray-700 hover:text-primary transition-colors ${location.pathname === '/analyze' ? 'font-semibold text-primary' : ''}`}
        >
          Analyze URL
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link 
              ref={el => { mobileMenuItemsRef.current[2] = el; }}
              to="/dashboard" 
              className={`text-gray-700 hover:text-primary transition-colors ${location.pathname === '/dashboard' ? 'font-semibold text-primary' : ''}`}
            >
              Dashboard
            </Link>
            <button 
              ref={el => { mobileMenuItemsRef.current[3] = el; }}
              onClick={logout}
              className="w-3/4 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              ref={el => { mobileMenuItemsRef.current[2] = el; }}
              to="/login" 
              className="w-3/4 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
            >
              Login
            </Link>
            <Link 
              ref={el => { mobileMenuItemsRef.current[3] = el; }}
              to="/register" 
              className="w-3/4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
