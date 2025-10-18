// hooks/useScrollToTop.js
const useScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // smooth scroll
    });
  };

  return scrollToTop;
};

export default useScrollToTop;
