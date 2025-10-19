const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((webVitals) => {
      // Use getCLS if available, handle cases where it might be undefined
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;
      
      // Call each metric function if it exists
      if (typeof getCLS === 'function') getCLS(onPerfEntry);
      if (typeof getFID === 'function') getFID(onPerfEntry);
      if (typeof getFCP === 'function') getFCP(onPerfEntry);
      if (typeof getLCP === 'function') getLCP(onPerfEntry);
      if (typeof getTTFB === 'function') getTTFB(onPerfEntry);
    }).catch((error) => {
      // Silently fail if web-vitals fails to load
      console.warn('Web Vitals module failed to load:', error);
    });
  }
};

export default reportWebVitals;
