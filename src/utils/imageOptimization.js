
/**
 * Phase 5 Image Component Import Helper
 * Use this to gradually migrate to optimized images
 */

// Import the new ProgressiveImage component
import ProgressiveImage from '../components/common/ProgressiveImage';
import '../components/common/ProgressiveImage.css';

/**
 * Migration guide for existing image usage:
 * 
 * BEFORE:
 * <img src="/Images/home/hero-banner-1.jpg" alt="Hero" />
 * 
 * AFTER:
 * <ProgressiveImage 
 *   src="/Images/home/hero-banner-1.jpg"
 *   alt="Hero"
 *   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 *   className="hero-image"
 *   lazy={true}
 * />
 */

// Helper function to generate optimized image sources
export const getOptimizedImageSrc = (originalSrc, format = 'webp') => {
  const baseName = originalSrc.split('.').slice(0, -1).join('.');
  const extension = originalSrc.split('.').pop();
  
  return {
    avif: `${baseName}.${format === 'avif' ? 'avif' : format}`,
    webp: `${baseName}.${format === 'webp' ? 'webp' : 'webp'}`,
    fallback: originalSrc
  };
};

// Helper function for responsive image sizes
export const getResponsiveSizes = (usage = 'default') => {
  const sizeMaps = {
    hero: '100vw',
    thumbnail: '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw',
    card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    default: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  };
  
  return sizeMaps[usage] || sizeMaps.default;
};

export default ProgressiveImage;
