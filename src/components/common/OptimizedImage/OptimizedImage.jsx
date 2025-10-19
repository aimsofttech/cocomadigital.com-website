import React, { useState, useRef, useEffect } from 'react';
import './OptimizedImage.css';

/**
 * Optimized Image Component with lazy loading, progressive enhancement,
 * and modern image formats support
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  sizes,
  priority = false,
  fallback,
  placeholder,
  webpSrc,
  avifSrc,
  blurDataURL,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(blurDataURL || placeholder);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, loading]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    // Handle load success
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      if (onLoad) onLoad();
    };
    
    // Handle load error
    img.onerror = () => {
      setHasError(true);
      if (fallback) {
        setCurrentSrc(fallback);
      }
      if (onError) onError();
    };

    // Start loading the image
    img.src = src;
  }, [isInView, src, fallback, onLoad, onError]);

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!src) return '';
    
    const baseSrc = src.split('.').slice(0, -1).join('.');
    const extension = src.split('.').pop();
    
    // Generate different sizes (you can customize these breakpoints)
    const sizes = [320, 640, 768, 1024, 1200];
    
    return sizes
      .map(size => {
        // Check if the image naming convention supports responsive sizes
        const responsiveSrc = `${baseSrc}-${size}w.${extension}`;
        return `${responsiveSrc} ${size}w`;
      })
      .join(', ');
  };

  // Get appropriate sizes attribute
  const getSizes = () => {
    if (sizes) return sizes;
    
    // Default responsive sizes
    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  };

  // Render picture element for modern image formats
  const renderPicture = () => (
    <picture>
      {/* AVIF source (best compression) */}
      {avifSrc && (
        <source
          srcSet={avifSrc}
          type="image/avif"
          sizes={getSizes()}
        />
      )}
      
      {/* WebP source (good compression, wide support) */}
      {webpSrc && (
        <source
          srcSet={webpSrc}
          type="image/webp"
          sizes={getSizes()}
        />
      )}
      
      {/* Fallback image */}
      <img
        ref={imgRef}
        src={currentSrc}
        srcSet={isInView ? generateSrcSet() : undefined}
        sizes={isInView ? getSizes() : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`optimized-image ${className} ${
          isLoaded ? 'loaded' : ''
        } ${hasError ? 'error' : ''}`}
        onLoad={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
        onError={() => {
          setHasError(true);
          if (onError) onError();
        }}
        {...props}
      />
    </picture>
  );

  // Render simple img for basic usage
  const renderImg = () => (
    <img
      ref={imgRef}
      src={currentSrc}
      srcSet={isInView ? generateSrcSet() : undefined}
      sizes={isInView ? getSizes() : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`optimized-image ${className} ${
        isLoaded ? 'loaded' : ''
      } ${hasError ? 'error' : ''}`}
      onLoad={() => {
        setIsLoaded(true);
        if (onLoad) onLoad();
      }}
      onError={() => {
        setHasError(true);
        if (onError) onError();
      }}
      {...props}
    />
  );

  return (
    <div className={`image-container ${isLoaded ? 'loaded' : 'loading'}`}>
      {/* Placeholder while loading */}
      {!isLoaded && (placeholder || blurDataURL) && (
        <div 
          className="image-placeholder"
          style={{
            backgroundImage: `url(${placeholder || blurDataURL})`,
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && !placeholder && !blurDataURL && (
        <div 
          className="image-skeleton"
          style={{
            width: width || '100%',
            height: height || '200px',
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      )}
      
      {/* Actual image */}
      {(webpSrc || avifSrc) ? renderPicture() : renderImg()}
      
      {/* Error fallback */}
      {hasError && !fallback && (
        <div className="image-error">
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;