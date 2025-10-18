import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./ServiceSlider.css";
import { useMediaQuery } from "react-responsive";
import ServiceCards from "./ServiceCards";

const CardCarousel = ({ data }) => {
  const carouselRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const isMobile = useMediaQuery({
    query: "(max-width: 650px)",
  });

  const updateButtonVisibility = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateButtonVisibility();
  }, [data]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const cardWidth = container.offsetWidth;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(updateButtonVisibility, 300);
    }
  };

  return (
    <>
      {!isMobile ? (
        <div className="carousel-container">
          {showLeftButton && (
            <button
              className="service-scroll-button left"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <FaChevronLeft size={22} />
            </button>
          )}

          <div
            className="cards-wrapper"
            ref={carouselRef}
            onScroll={updateButtonVisibility}
          >
            {data?.map((item, index) => {
              return (
                <ServiceCards key={index} data={item} />
              );
            })}
          </div>
          {showRightButton && (
            <button
              className="service-scroll-button right"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <FaChevronRight size={22} />
            </button>
          )}
        </div>
      ) : (
        <div className="service-slider-mobile-wrapper">
          {data?.map((item, index) => {
            return (
              <ServiceCards key={index} data={item} />
            );
          })}
        </div>
      )}
    </>
  );
};

export default CardCarousel;
