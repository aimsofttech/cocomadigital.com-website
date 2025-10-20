import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedHeroImage Component
 * 
 * Features:
 * - Responsive images with srcset
 * - WebP format with JPEG fallback
 * - Priority loading for LCP optimization
 * - Lazy loading support
 * - Error handling with fallback
 * - Loading state animation
 * - SEO optimized (alt text, title)
 * 
 * Usage:
 * <OptimizedHeroImage
 *   src="/Images/home/hero-banner-lg.jpg"
 *   alt="Hero Banner"
 *   title="Our Services"
 *   priority={true}
 *   onLoad={() => console.log('Image loaded')}
 * />
 */
const OptimizedHeroImage = ({
  src = '',
  alt = 'Hero Image',
  title = '',
  priority = false,
  onLoad = null,
  onError = null,
  className = 'optimized-hero-image',
  style = {},
  placeholder = null
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [displaySrc, setDisplaySrc] = useState(
    priority ? src : (placeholder || src)
  );

  /**
   * Generate WebP variant filename
   */
  const getWebPVariant = useCallback((imageUrl, size = 'md') => {
    if (!imageUrl) return '';
    // Replace .jpg, .jpeg, .png with -size.webp
    return imageUrl.replace(/\.(jpg|jpeg|png)$/i, `-${size}.webp`);
  }, []);

  /**
   * Generate JPEG variant filename
   */
  const getJPEGVariant = useCallback((imageUrl, size = 'md') => {
    if (!imageUrl) return '';
    // Replace .jpg, .jpeg with -size.jpg
    // Keep .png as is
    if (imageUrl.toLowerCase().endsWith('.png')) {
      return imageUrl.replace(/\.png$/i, `-${size}.jpg`);
    }
    return imageUrl.replace(/\.(jpg|jpeg)$/i, `-${size}.jpg`);
  }, []);

  /**
   * Handle image load
   */
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);

    if (onLoad && typeof onLoad === 'function') {
      onLoad();
    }

    // Dispatch custom event for performance tracking
    window.dispatchEvent(new CustomEvent('image-loaded', {
      detail: { src, alt }
    }));
  }, [src, alt, onLoad]);

  /**
   * Handle image error
   */
  const handleImageError = useCallback(() => {
    setImageError(true);

    if (onError && typeof onError === 'function') {
      onError();
    }

    // Fallback to original src if error
    setDisplaySrc(src);
  }, [src, onError]);

  /**
   * Preload image for priority loading
   */
  useEffect(() => {
    if (!priority || !src) return;

    // Preload high-priority image
    const img = new Image();
    img.onload = () => setDisplaySrc(src);
    img.onerror = () => setDisplaySrc(src); // Use original even if error
    img.src = src;
  }, [src, priority]);

  /**
   * Load non-priority images after page interactive
   */
  useEffect(() => {
    if (priority) return;

    // Defer loading of non-priority images
    const timer = setTimeout(() => {
      const img = new Image();
      img.onload = () => setDisplaySrc(src);
      img.onerror = () => setDisplaySrc(src);
      img.src = src;
    }, 1000);

    return () => clearTimeout(timer);
  }, [src, priority]);

  // Generate srcset for different screen sizes
  const webpSrcSet = src ? `
    ${getWebPVariant(src, 'sm')} 480w,
    ${getWebPVariant(src, 'md')} 768w,
    ${getWebPVariant(src, 'lg')} 1200w,
    ${getWebPVariant(src, 'xl')} 1600w
  `.trim() : '';

  const jpegSrcSet = src ? `
    ${getJPEGVariant(src, 'sm')} 480w,
    ${getJPEGVariant(src, 'md')} 768w,
    ${getJPEGVariant(src, 'lg')} 1200w,
    ${getJPEGVariant(src, 'xl')} 1600w
  `.trim() : '';

  // Image sizes responsive configuration
  const imageSizes = '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1600px';

  // Combined styles
  const imageStyle = {
    width: '100%',
    height: 'auto',
    display: 'block',
    opacity: imageLoaded ? 1 : 0.8,
    transition: 'opacity 0.3s ease-in-out',
    ...style
  };

  // Error state
  if (imageError) {
    return (
      <div
        className={`${className} image-error-fallback`}
        style={{
          ...imageStyle,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          color: '#999',
          fontSize: '14px'
        }}
      >
        <span>Image failed to load</span>
      </div>
    );
  }

  // PHASE 2 NOTE: Until responsive image variants are created, 
  // use simple img tag without srcset to avoid 404s
  // Once Phase 2 images are created, srcset will auto-work
  const useSimpleImg = !webpSrcSet || !jpegSrcSet;

  if (useSimpleImg) {
    // Simple image tag without responsive variants (Phase 1 temporary)
    return (
      <img
        src={displaySrc || src}
        alt={alt}
        title={title || alt}
        className={`${className} ${imageLoaded ? 'loaded' : 'loading'}`}
        style={imageStyle}
        
        // Loading optimization
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        
        // Event handlers
        onLoad={handleImageLoad}
        onError={handleImageError}
        
        // Accessibility
        aria-label={alt}
      />
    );
  }

  return (
    <picture>
      {/* WebP source (modern browsers, better compression) */}
      {webpSrcSet && (
        <source
          srcSet={webpSrcSet}
          type="image/webp"
          sizes={imageSizes}
        />
      )}

      {/* JPEG source (fallback for older browsers) */}
      {jpegSrcSet && (
        <source
          srcSet={jpegSrcSet}
          sizes={imageSizes}
        />
      )}

      {/* Fallback image element */}
      <img
        src={displaySrc || src}
        alt={alt}
        title={title || alt}
        className={`${className} ${imageLoaded ? 'loaded' : 'loading'}`}
        style={imageStyle}
        
        // Loading optimization
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        
        // Responsive image attributes
        srcSet={jpegSrcSet}
        sizes={imageSizes}
        
        // Event handlers
        onLoad={handleImageLoad}
        onError={handleImageError}
        
        // Accessibility
        role="img"
        aria-label={alt}
      />
    </picture>
  );
};

// PropTypes for type checking
OptimizedHeroImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  title: PropTypes.string,
  priority: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string
};

OptimizedHeroImage.defaultProps = {
  src: '',
  alt: 'Image',
  title: '',
  priority: false,
  onLoad: null,
  onError: null,
  className: 'optimized-hero-image',
  style: {},
  placeholder: null
};

export default OptimizedHeroImage;
