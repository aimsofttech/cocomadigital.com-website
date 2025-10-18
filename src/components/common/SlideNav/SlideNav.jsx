import { useRef, useState, useEffect } from "react";
import "./SlideNav.css"
import { useMediaQuery } from 'react-responsive'

const SlideNav = ({ categories, activeCategoryId, setActiveCategoryId }) => {
  const scrollContainerRef = useRef(null);
  const listRef = useRef(null);
  const isMobile = useMediaQuery({
    query: '(max-width: 576px)'
  })
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  const scrollAmount = 180;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Update scroll button visibility
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }
  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, []);


  useEffect(() => {
    checkScrollPosition();
  }, []);

  const checkScrollPosition = () => {
    if (listRef.current) {
      setCanScrollUp(listRef.current.scrollTop > 0);
      setCanScrollDown(
        listRef.current.scrollTop + listRef.current.clientHeight <
        listRef.current.scrollHeight
      );
    }
  };

  const scrollUp = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: -100, behavior: "smooth" });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const scrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: 100, behavior: "smooth" });
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <>
        {/* design for large screen */}
      {!isMobile &&
        <div className={`home-slide-nav-wraper`}>
          <div className="home-slide-nav">
            {/* Left scroll button */}
            <button
              onClick={scrollLeft}
              className={`home-latest-work-header-scroll-button left ${showLeftButton ? "visible" : "hidden"}`}
              aria-label="Scroll left"
            >
              <div className="home-latest-work-header-button-content mr-5">
                <img
                  src="/Images/home/secondary-arrow-icon.svg"
                  className="left-scroll-icon" alt="items-logo" />
              </div>
            </button>
            {/* Scrollable container */}
            <div ref={scrollContainerRef} className="home-latest-work-header-scroll-container">
              <div className="home-latest-work-header-items-wraper">
                <div className={`home-silde-nav-icon-title-wraper 
          ${activeCategoryId === -1 ? "active" : ""}
        `}
                  onClick={() => setActiveCategoryId(-1)}
                >
                  <img src="/Images/home/all-content-icon.svg" className="home-silde-nav-icon" alt="items-logo" />
                  <div
                    className={`home-slide-nav-items`}
                  >
                    All
                  </div>
                </div>
                {categories?.map((category, index) => (
                  <div
                    key={index}
                    className={`home-silde-nav-icon-title-wraper ${activeCategoryId === category?.id ? "active" : ""}`}
                    onClick={() => setActiveCategoryId(category?.id)}
                  >
                    {category?.icon && <img src={category?.icon} className="home-silde-nav-icon" alt="items-logo" />}
                    <p className="home-slide-nav-items">
                      {category?.category_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right scroll button */}
            <button
              onClick={scrollRight}
              className={`home-latest-work-header-scroll-button right ${showRightButton ? "visible" : "hidden"}`}
              aria-label="Scroll right"
            >
              <div className="home-latest-work-header-button-content ml-5">
                <img src="/Images/home/secondary-arrow-icon.svg" className="right-scroll-icon" alt="items-logo" />
              </div>
            </button>
          </div>
        </div>}
      {/* design for mobile screen */}
      {
        isMobile &&
        <div className="scroll-container">
          {canScrollUp && (
            <div className="res-scroll-btn top-btn">
              <button onClick={scrollUp}>
                <img src="/Images/home/secondary-arrow-icon.svg" className="top-scroll-icon" alt="items-logo" />
              </button>
            </div>
          )}
          <div className="scroll-box" ref={listRef} onScroll={checkScrollPosition}>
            <div className="scroll-activebar-list-wraper">
              <div
                className={`scroll-activebar ${activeCategoryId === -1 ? "active" : ""}`} >
              </div>
              <div className={`scroll-list-icon-title-wraper`}
                onClick={() => setActiveCategoryId(-1)}
              >
                <img src="/Images/home/all-content-icon.svg" className="home-silde-nav-icon" alt="items-logo" />
                <div
                  className={`home-slide-nav-items`}
                >
                  All
                </div>
              </div>
            </div>
            {categories?.map((category, index) => (
              <div key={index} className="scroll-activebar-list-wraper">
                <div
                  className={`scroll-activebar ${activeCategoryId === category?.id ? "active" : ""}`} >
                </div>
                <div
                  key={category?.id}
                  className={`scroll-list-icon-title-wraper`}
                  onClick={() => setActiveCategoryId(category?.id)}
                >
                  {category?.icon && <img src={category?.icon} className="home-silde-nav-icon" alt="items-logo" />}
                  <p className="home-slide-nav-items">
                    {category?.category_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {canScrollDown && (
            <div className="res-scroll-btn bottom-btn">
              <button onClick={scrollDown}>
                <img src="/Images/home/secondary-arrow-icon.svg" className="left-scroll-icon" alt="items-logo" />
              </button>
            </div>
          )}
        </div>
      }
    </>
  )
}

export default SlideNav;