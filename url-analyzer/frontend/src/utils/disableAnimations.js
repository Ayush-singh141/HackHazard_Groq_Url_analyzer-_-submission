// Utility to disable all GSAP animations temporarily
import { gsap } from 'gsap';

export const disableAnimations = () => {
  // Store original methods
  const originalFrom = gsap.from;
  const originalTo = gsap.to;
  const originalTimeline = gsap.timeline;
  
  // Override GSAP methods with no-op versions that just set final state
  gsap.from = (targets, vars) => {
    // Extract the final state (removing animation properties)
    const { opacity, y, x, duration, delay, ease, ...finalState } = vars;
    
    // Just set the element to its final state
    if (typeof targets === 'string') {
      const elements = document.querySelectorAll(targets);
      elements.forEach(el => Object.assign(el.style, finalState));
    } else if (targets && targets.style) {
      Object.assign(targets.style, finalState);
    }
    
    return { kill: () => {} }; // Return dummy object
  };
  
  gsap.to = (targets, vars) => {
    // Extract the final state (removing animation properties)
    const { duration, delay, ease, ...finalState } = vars;
    
    // Just set the element to its final state
    if (typeof targets === 'string') {
      const elements = document.querySelectorAll(targets);
      elements.forEach(el => Object.assign(el.style, finalState));
    } else if (targets && targets.style) {
      Object.assign(targets.style, finalState);
    }
    
    return { kill: () => {} }; // Return dummy object
  };
  
  gsap.timeline = () => {
    return {
      from: () => ({ kill: () => {} }),
      to: () => ({ kill: () => {} }),
      kill: () => {}
    };
  };
  
  // Function to restore original GSAP methods
  const restoreAnimations = () => {
    gsap.from = originalFrom;
    gsap.to = originalTo;
    gsap.timeline = originalTimeline;
  };
  
  return restoreAnimations;
};

export default disableAnimations; 