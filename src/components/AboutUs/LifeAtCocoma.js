import { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const LifeAtCocoma = () => {
  const [filter, setFilter] = useState("All");
  const carouselRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Slider data
  const slides = [
    { id: 1, category: "Social Work", image: "/Images/about/aboutStory.png" },
    { id: 2, category: "Education", image: "/Images/about/aboutStory.png" },
    { id: 3, category: "Environment", image: "/Images/about/aboutStory.png" },
    { id: 4, category: "Social Work", image: "/Images/about/aboutStory.png" },
    { id: 5, category: "Education", image: "/Images/about/aboutStory.png" },
    { id: 6, category: "Environment", image: "/Images/about/aboutStory.png" },
  ];

  // Categories
  const categories = ["All", "Social Work", "Education", "Environment"];

  // Filtering logic
  const filteredSlides =
    filter === "All"
      ? slides
      : slides.filter((slide) => slide.category === filter);

  // Slider settings for categories
  const categorySliderSettings = {
    infinite: false,
    slidesToShow: categories.length > 7 ? 3 : categories.length,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 5 } },
      { breakpoint: 576, settings: { slidesToShow: 3 } },
    ],
  };

  const updateButtonVisibility = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateButtonVisibility();
  }, []);

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
    <div className="about-us-section-main-wrapper">
      <div className="pt-5 about-us-section-main">
        {/* Section Title */}
        <div className="about-us-third-section-slider-content-wrapper">
          <h1>Life at Cocoma</h1>
          <p>
            At Cocoma Digital, life is a blend of creativity, collaboration, and
            constant growth. Our team thrives in an environment that encourages
            innovation, learning, and a strong sense of community. From
            brainstorming sessions to high-energy video shoots, our workspace is
            designed to foster creativity and inspire excellence. We take pride
            in our social responsibility initiatives, from supporting
            underprivileged communities to championing gender equality and
            inclusivity. Whether it’s through our volunteer activities or
            team-building events, life at Cocoma is about making a positive
            impact – both inside and outside the office. Join us, and be part of
            a team that’s not just creating content, but shaping the future of
            digital media.
          </p>
        </div>

        {/* Category Buttons */}
        <div className="my-4">
          <Slider {...categorySliderSettings} className="SliderCustom-width">
            {categories?.map((category) => (
              <button
                key={category}
                className={` btn w-auto  ${
                  filter === category ? "btn-dark" : "btn-light"
                } mx-2`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </Slider>
        </div>

        {/* Slides */}
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
            className="about-cards-wrapper"
            ref={carouselRef}
            onScroll={updateButtonVisibility}
          >
            {filteredSlides?.map((slide) => (
              <div key={slide?.id} className="card">
                <img
                  src={slide?.image}
                  className="card-img-top"
                  alt={slide?.category}
                />
                <div className="card-body text-center">
                  <h6 className="card-title">{slide?.category}</h6>
                </div>
              </div>
            ))}
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
      </div>
    </div>
  );
};

export default LifeAtCocoma;
