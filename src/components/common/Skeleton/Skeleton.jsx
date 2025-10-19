import React from 'react';
import './Skeleton.css';

// Generic skeleton wrapper
export const Skeleton = ({ className = '', children, ...props }) => (
  <div className={`skeleton ${className}`} {...props}>
    {children}
  </div>
);

// Skeleton for cards/services
export const SkeletonCard = ({ count = 1 }) => (
  <div className="skeleton-card-container">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="skeleton-card">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-description"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for header navigation
export const SkeletonHeader = () => (
  <div className="skeleton-header">
    <div className="skeleton-logo"></div>
    <div className="skeleton-nav">
      <div className="skeleton-nav-item"></div>
      <div className="skeleton-nav-item"></div>
      <div className="skeleton-nav-item"></div>
      <div className="skeleton-nav-item"></div>
    </div>
    <div className="skeleton-button"></div>
  </div>
);

// Skeleton for text content
export const SkeletonText = ({ lines = 3, width = '100%' }) => (
  <div className="skeleton-text-container" style={{ width }}>
    {Array.from({ length: lines }).map((_, index) => (
      <div 
        key={index} 
        className="skeleton-text-line"
        style={{ 
          width: index === lines - 1 ? '70%' : '100%' 
        }}
      ></div>
    ))}
  </div>
);

// Skeleton for hero banner section
export const SkeletonHeroBanner = () => (
  <div className="skeleton-hero-banner">
    <div className="skeleton-hero-content">
      <div className="skeleton-hero-title"></div>
      <div className="skeleton-hero-subtitle"></div>
      <div className="skeleton-hero-buttons">
        <div className="skeleton-button skeleton-button-primary"></div>
        <div className="skeleton-button skeleton-button-secondary"></div>
      </div>
    </div>
    <div className="skeleton-hero-image"></div>
  </div>
);

// Skeleton for footer
export const SkeletonFooter = () => (
  <div className="skeleton-footer">
    <div className="skeleton-footer-section">
      <div className="skeleton-footer-logo"></div>
      <div className="skeleton-footer-social">
        <div className="skeleton-social-icon"></div>
        <div className="skeleton-social-icon"></div>
        <div className="skeleton-social-icon"></div>
        <div className="skeleton-social-icon"></div>
      </div>
    </div>
    <div className="skeleton-footer-links">
      <div className="skeleton-footer-column">
        <div className="skeleton-footer-title"></div>
        <div className="skeleton-footer-link"></div>
        <div className="skeleton-footer-link"></div>
        <div className="skeleton-footer-link"></div>
      </div>
      <div className="skeleton-footer-column">
        <div className="skeleton-footer-title"></div>
        <div className="skeleton-footer-link"></div>
        <div className="skeleton-footer-link"></div>
        <div className="skeleton-footer-link"></div>
      </div>
      <div className="skeleton-footer-column">
        <div className="skeleton-footer-title"></div>
        <div className="skeleton-footer-link"></div>
        <div className="skeleton-footer-link"></div>
        <div className="skeleton-footer-link"></div>
      </div>
    </div>
  </div>
);

// Skeleton for services grid
export const SkeletonServicesGrid = ({ count = 6 }) => (
  <div className="skeleton-services-grid">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="skeleton-service-item">
        <div className="skeleton-service-icon"></div>
        <div className="skeleton-service-title"></div>
        <div className="skeleton-service-description"></div>
      </div>
    ))}
  </div>
);

// Loading spinner component
export const LoadingSpinner = ({ size = 'medium', color = '#007bff' }) => (
  <div className={`loading-spinner loading-spinner-${size}`}>
    <div 
      className="spinner-circle" 
      style={{ borderTopColor: color }}
    ></div>
  </div>
);

// Page loading component
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="page-loader">
    <LoadingSpinner size="large" />
    <p className="page-loader-message">{message}</p>
  </div>
);