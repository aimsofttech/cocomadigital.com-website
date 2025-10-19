
/**
 * Phase 5 Week 3: Touch Optimization Utilities
 * React hooks and utilities for mobile touch interactions
 */

import { useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for optimized touch events
 */
export const useTouch = (onTouch) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      // Prevent zoom on double tap
      e.preventDefault();
      onTouch?.(e);
    };

    const handleTouchEnd = (e) => {
      // Add touch feedback
      element.style.transform = 'scale(1)';
    };

    const handleTouchCancel = () => {
      element.style.transform = 'scale(1)';
    };

    // Add passive event listeners for better performance
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [onTouch]);

  return elementRef;
};

/**
 * Mobile-optimized button component
 */
export const MobileButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'medium',
  ...props 
}) => {
  const touchRef = useTouch();

  const baseClasses = 'mobile-btn';
  const variantClasses = {
    primary: 'mobile-btn-primary',
    secondary: 'mobile-btn-secondary',
    outline: 'mobile-btn-outline'
  };
  const sizeClasses = {
    small: 'mobile-btn-sm',
    medium: 'mobile-btn-md',
    large: 'mobile-btn-lg'
  };

  const handleClick = useCallback((e) => {
    // Add haptic feedback if available
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(50);
    }
    onClick?.(e);
  }, [onClick]);

  return (
    <button
      ref={touchRef}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Mobile-optimized image component with touch zoom
 */
export const MobileTouchImage = ({ 
  src, 
  alt, 
  className = '',
  enableZoom = false,
  ...props 
}) => {
  const imageRef = useRef(null);

  useEffect(() => {
    if (!enableZoom) return;

    const image = imageRef.current;
    if (!image) return;

    let scale = 1;
    let originX = 0;
    let originY = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        originX = (touch1.clientX + touch2.clientX) / 2;
        originY = (touch1.clientY + touch2.clientY) / 2;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        // Simple pinch zoom implementation
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        scale = Math.min(Math.max(distance / 100, 0.5), 3);
        image.style.transform = `scale(${scale})`;
        image.style.transformOrigin = `${originX}px ${originY}px`;
      }
    };

    image.addEventListener('touchstart', handleTouchStart, { passive: false });
    image.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      image.removeEventListener('touchstart', handleTouchStart);
      image.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enableZoom]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={`mobile-touch-image ${className}`}
      loading="lazy"
      {...props}
    />
  );
};

/**
 * Mobile viewport detection hook
 */
export const useMobileViewport = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [viewport, setViewport] = React.useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width < 768);
      setViewport({ width, height });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return { isMobile, viewport };
};

/**
 * Touch gesture detection utilities
 */
export const touchGestures = {
  // Detect swipe direction
  detectSwipe: (startTouch, endTouch, threshold = 50) => {
    const deltaX = endTouch.clientX - startTouch.clientX;
    const deltaY = endTouch.clientY - startTouch.clientY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        return deltaX > 0 ? 'right' : 'left';
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        return deltaY > 0 ? 'down' : 'up';
      }
    }
    return null;
  },

  // Add touch ripple effect
  addRipple: (element, e) => {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
};

// CSS for touch utilities (add to your CSS file)
export const touchCSS = `
.mobile-btn {
  position: relative;
  overflow: hidden;
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
  transition: all 0.2s ease;
}

.mobile-btn:active {
  transform: scale(0.95);
}

.mobile-btn-primary {
  background-color: #007bff;
  color: white;
}

.mobile-btn-secondary {
  background-color: #6c757d;
  color: white;
}

.mobile-btn-outline {
  background-color: transparent;
  border: 2px solid #007bff;
  color: #007bff;
}

.mobile-btn-sm {
  min-height: 36px;
  padding: 8px 16px;
  font-size: 14px;
}

.mobile-btn-lg {
  min-height: 56px;
  padding: 16px 32px;
  font-size: 18px;
}

.mobile-touch-image {
  touch-action: pinch-zoom;
  user-select: none;
  transition: transform 0.2s ease;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple-animation 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
`;
