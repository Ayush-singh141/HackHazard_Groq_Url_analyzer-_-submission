import { useEffect, useRef, useState } from 'react';
import logoColored from '../assets/logo-colored.svg';

const Logo = ({ size = 'default' }) => {
  const logoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Size classes based on the size prop
  const sizeClasses = {
    small: 'h-6 w-6',
    default: 'h-8 w-8',
    large: 'h-10 w-10'
  };
  
  // Check for mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Apply initial animation when component mounts
  useEffect(() => {
    setIsLoaded(true);
    
    // Logo hover effect
    const logo = logoRef.current;
    if (!logo) return;
    
    // Skip initial animation on mobile
    if (!isMobile) {
      // Initial subtle pulse animation with reduced intensity for better performance
      logo.style.animation = 'pulse 1.5s ease-in-out';
    }
    
    // Only add hover effects on non-mobile devices
    if (!isMobile) {
      const handleMouseEnter = () => {
        logo.style.transform = 'rotate(10deg) scale(1.1)';
        logo.style.transition = 'transform 0.3s ease';
      };
      
      const handleMouseLeave = () => {
        logo.style.transform = 'rotate(0deg) scale(1)';
        logo.style.transition = 'transform 0.3s ease';
      };
      
      logo.addEventListener('mouseenter', handleMouseEnter);
      logo.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        logo.removeEventListener('mouseenter', handleMouseEnter);
        logo.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isMobile]);
  
  return (
    <img 
      ref={logoRef} 
      src={logoColored} 
      alt="URL Analyzer Logo" 
      className={`${sizeClasses[size] || sizeClasses.default} mr-2 ${isLoaded && !isMobile ? 'animate-pulse' : ''}`}
      style={{ animationDuration: isMobile ? '0s' : '3s' }}
    />
  );
};

export default Logo; 