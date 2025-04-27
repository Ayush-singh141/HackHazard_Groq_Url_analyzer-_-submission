import { gsap } from 'gsap';

// Page transition animations
export const pageEnterAnimation = (element, delay = 0) => {
  if (!element) return null;
  
  const timeline = gsap.timeline();
  
  timeline.fromTo(
    element,
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: 'power3.out',
      delay 
    }
  );
  
  return timeline;
};

export const pageExitAnimation = (element) => {
  const timeline = gsap.timeline();
  
  timeline.to(
    element,
    { 
      opacity: 0, 
      y: -20, 
      duration: 0.4, 
      ease: 'power2.in' 
    }
  );
  
  return timeline;
};

// Staggered text animation
export const staggerTextAnimation = (elements, staggerTime = 0.1, delay = 0) => {
  const timeline = gsap.timeline({ delay });
  
  timeline.fromTo(
    elements,
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      stagger: staggerTime, 
      ease: 'power3.out' 
    }
  );
  
  return timeline;
};

// Reveal element animation
export const revealAnimation = (element, direction = 'bottom', delay = 0) => {
  if (!element) {
    console.warn('RevealAnimation: Element is null or undefined');
    return null;
  }
  
  const timeline = gsap.timeline({ delay });
  let fromProps = {};
  
  switch (direction) {
    case 'left':
      fromProps = { x: -50, opacity: 0 };
      break;
    case 'right':
      fromProps = { x: 50, opacity: 0 };
      break;
    case 'top':
      fromProps = { y: -50, opacity: 0 };
      break;
    case 'bottom':
    default:
      fromProps = { y: 50, opacity: 0 };
      break;
  }
  
  // Set initial properties manually before animation
  gsap.set(element, fromProps);
  
  timeline.to(
    element,
    { 
      x: 0, 
      y: 0, 
      opacity: 1, 
      duration: 0.7, 
      ease: 'power3.out' 
    }
  );
  
  return timeline;
};

// Button hover animation
export const buttonHoverAnimation = (button) => {
  const hoverTimeline = gsap.timeline({ paused: true });
  
  hoverTimeline.to(
    button,
    { 
      scale: 1.05, 
      duration: 0.3, 
      ease: 'power2.out' 
    }
  );
  
  button.addEventListener('mouseenter', () => hoverTimeline.play());
  button.addEventListener('mouseleave', () => hoverTimeline.reverse());
  
  return hoverTimeline;
};

// Loading animation
export const loadingAnimation = (elements, repeat = -1) => {
  const timeline = gsap.timeline({ repeat, repeatDelay: 0.5 });
  
  timeline.fromTo(
    elements,
    { opacity: 0.3, scale: 0.9 },
    { 
      opacity: 1, 
      scale: 1, 
      duration: 0.8, 
      stagger: 0.2, 
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 1
    }
  );
  
  return timeline;
};

// Typing animation
export const typingAnimation = (element, text, speed = 30) => {
  let currentText = '';
  const originalText = text;
  
  // Reset the element's text
  if (element) {
    element.textContent = '';
  }
  
  const timeline = gsap.timeline();
  
  const type = (index = 0) => {
    if (!element) return;
    
    if (index < originalText.length) {
      currentText += originalText[index];
      element.textContent = currentText;
      timeline.add(
        gsap.delayedCall(speed / 1000, () => type(index + 1))
      );
    }
  };
  
  type();
  
  return timeline;
};

// Modern card reveal animation
export const cardRevealAnimation = (element, delay = 0) => {
  const timeline = gsap.timeline({ delay });
  
  timeline.fromTo(
    element,
    { 
      opacity: 0, 
      y: 40,
      rotationX: 10,
      transformPerspective: 800 
    },
    { 
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'power3.out'
    }
  );
  
  return timeline;
};

// Staggered card grid animation
export const staggeredCardAnimation = (cards, staggerTime = 0.1, delay = 0) => {
  const timeline = gsap.timeline({ delay });
  
  timeline.fromTo(
    cards,
    { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      transformOrigin: 'center bottom'
    },
    { 
      opacity: 1, 
      y: 0,
      scale: 1,
      duration: 0.7, 
      stagger: staggerTime, 
      ease: 'elastic.out(1, 0.75)' 
    }
  );
  
  return timeline;
};

// Navbar animation
export const navbarAnimation = (navbar, links, delay = 0) => {
  const timeline = gsap.timeline({ delay });
  
  timeline
    .fromTo(
      navbar,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )
    .fromTo(
      links,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );
  
  return timeline;
};

// Mobile menu animation
export const mobileMenuAnimation = (menu, items) => {
  const openTimeline = gsap.timeline({ paused: true });
  
  openTimeline
    .fromTo(
      menu,
      { opacity: 0, height: 0 },
      { opacity: 1, height: 'auto', duration: 0.4, ease: 'power2.out' }
    )
    .fromTo(
      items,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' },
      '-=0.2'
    );
  
  return openTimeline;
};

// Section expand animation
export const expandSectionAnimation = (section, content) => {
  const expandTimeline = gsap.timeline({ paused: true });
  
  expandTimeline
    .fromTo(
      content,
      { opacity: 0, height: 0 },
      { opacity: 1, height: 'auto', duration: 0.4, ease: 'power2.out' }
    );
  
  return expandTimeline;
};

// Button pulse animation
export const buttonPulseAnimation = (button) => {
  const pulseTimeline = gsap.timeline({ repeat: -1, paused: true });
  
  pulseTimeline
    .to(
      button,
      { 
        scale: 1.05, 
        boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)', 
        duration: 0.8, 
        ease: 'sine.inOut' 
      }
    )
    .to(
      button,
      { 
        scale: 1, 
        boxShadow: '0 0 0px rgba(59, 130, 246, 0)', 
        duration: 0.8, 
        ease: 'sine.inOut' 
      }
    );
  
  return pulseTimeline;
}; 