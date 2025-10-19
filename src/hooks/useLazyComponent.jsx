import { useState, useEffect, useRef, lazy, Suspense } from 'react';

/**
 * Custom hook for lazy loading components when they come into view
 * @param {number} threshold - Intersection threshold (0-1)
 * @param {string} rootMargin - Root margin for intersection observer
 * @returns {[ref, inView, LazyComponent]} - ref for target element, inView boolean, LazyComponent wrapper
 */
export const useLazyComponent = (threshold = 0.1, rootMargin = '50px') => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Stop observing once in view
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const LazyComponent = ({ loader, fallback, children, ...props }) => {
    if (!inView) {
      return <div ref={ref} {...props}>{fallback}</div>;
    }

    const Component = lazy(loader);
    
    return (
      <div ref={ref} {...props}>
        <Suspense fallback={fallback}>
          <Component>{children}</Component>
        </Suspense>
      </div>
    );
  };

  return [ref, inView, LazyComponent];
};

/**
 * Higher-order component for lazy loading
 * @param {Function} importFunc - Dynamic import function
 * @param {Component} fallback - Fallback component while loading
 * @returns {Component} - Lazy loaded component
 */
export const withLazyLoading = (importFunc, fallback = null) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Component for lazy loading with intersection observer
 * @param {Object} props - Component props
 * @param {Function} props.loader - Dynamic import function
 * @param {Component} props.fallback - Fallback component
 * @param {number} props.threshold - Intersection threshold
 * @param {string} props.rootMargin - Root margin for intersection observer
 * @param {Object} props.children - Child components
 * @returns {Component} - Lazy loaded component
 */
export const LazyLoadComponent = ({ 
  loader, 
  fallback, 
  threshold = 0.1, 
  rootMargin = '50px',
  className = '',
  style = {},
  children,
  ...props 
}) => {
  const [ref, inView] = useLazyComponent(threshold, rootMargin);

  if (!inView) {
    return (
      <div 
        ref={ref} 
        className={`lazy-loading ${className}`} 
        style={style}
        {...props}
      >
        {fallback}
      </div>
    );
  }

  const Component = lazy(loader);
  
  return (
    <div 
      ref={ref} 
      className={className} 
      style={style}
      {...props}
    >
      <Suspense fallback={fallback}>
        <Component>{children}</Component>
      </Suspense>
    </div>
  );
};

export default useLazyComponent;