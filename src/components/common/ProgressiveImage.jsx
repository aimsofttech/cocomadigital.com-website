import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Phase 5 Progressive Image Component
 * Conservative approach - smooth progressive loading with fallbacks
 */
const ProgressiveImage = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  lowQualitySrc = null,
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  lazy = true,
  threshold = 0.1,
  ...props
}) => {
  const [imageState, setImageState] = useState('loading');
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || placeholder);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generate responsive image sources
  const generateSources = (baseSrc) => {
    if (!baseSrc) return [];
    
    const baseName = baseSrc.split('.').slice(0, -1).join('.');
    const extension = baseSrc.split('.').pop();
    
    return [
      {
        media: '(max-width: 768px)',
        srcSet: `
          ${baseName}-mobile.avif 480w,
          ${baseName}-mobile.webp 480w,
          ${baseName}-mobile.${extension} 480w
        `,
        type: 'image/avif'
      },
      {
        media: '(max-width: 1024px)',
        srcSet: `
          ${baseName}-tablet.avif 768w,
          ${baseName}-tablet.webp 768w,
          ${baseName}-tablet.${extension} 768w
        `,
        type: 'image/avif'
      },
      {
        media: '(min-width: 1025px)',
        srcSet: `
          ${baseName}-desktop.avif 1200w,
          ${baseName}-desktop.webp 1200w,
          ${baseName}-desktop.${extension} 1200w
        `,
        type: 'image/avif'
      }
    ];
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin: '50px'
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
  }, [lazy, isInView, threshold]);

  // Load high quality image when in view
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    
    // Conservative approach - load with error handling
    img.onload = () => {
      setCurrentSrc(src);
      setImageState('loaded');
      onLoad();
    };
    
    img.onerror = () => {
      setImageState('error');
      onError();
      
      // Fallback to low quality if high quality fails
      if (lowQualitySrc && currentSrc !== lowQualitySrc) {
        setCurrentSrc(lowQualitySrc);
        setImageState('fallback');
      }
    };
    
    img.src = src;
  }, [isInView, src, lowQualitySrc, currentSrc, onLoad, onError]);

  // Generate CSS classes based on state
  const getImageClasses = () => {
    const baseClasses = ['progressive-image'];
    
    if (className) baseClasses.push(className);
    
    switch (imageState) {
      case 'loading':
        baseClasses.push('progressive-image--loading');
        break;
      case 'loaded':
        baseClasses.push('progressive-image--loaded');
        break;
      case 'error':
        baseClasses.push('progressive-image--error');
        break;
      case 'fallback':
        baseClasses.push('progressive-image--fallback');
        break;
      default:
        break;
    }
    
    return baseClasses.join(' ');
  };

  // Render placeholder while not in view
  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={`progressive-image-placeholder ${className}`}
        style={{
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          ...props.style
        }}
        {...props}
      >
        {placeholder ? (
          <img src={placeholder} alt={alt} className="placeholder-img" />
        ) : (
          <div className="loading-spinner">Loading...</div>
        )}
      </div>
    );
  }

  // Generate responsive sources
  const sources = generateSources(src);

  return (
    <picture className="progressive-picture">
      {/* AVIF sources (next-gen format) */}
      {sources.map((source, index) => (
        <source
          key={`avif-${index}`}
          media={source.media}
          srcSet={source.srcSet.replace(/\.(webp|jpg|jpeg|png)/g, '.avif')}
          type="image/avif"
        />
      ))}
      
      {/* WebP sources (widely supported) */}
      {sources.map((source, index) => (
        <source
          key={`webp-${index}`}
          media={source.media}
          srcSet={source.srcSet.replace(/\.(jpg|jpeg|png)/g, '.webp')}
          type="image/webp"
        />
      ))}
      
      {/* Fallback image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={getImageClasses()}
        sizes={sizes}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={() => {
          if (imageState === 'loading') {
            setImageState('loaded');
            onLoad();
          }
        }}
        onError={() => {
          setImageState('error');
          onError();
        }}
        {...props}
      />
    </picture>
  );
};

ProgressiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  sizes: PropTypes.string,
  lowQualitySrc: PropTypes.string,
  placeholder: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  lazy: PropTypes.bool,
  threshold: PropTypes.number
};

export default ProgressiveImage;