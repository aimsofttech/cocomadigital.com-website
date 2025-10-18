import React, { useRef } from "react";
import Slider from "react-slick";
import { IoIosArrowForward } from "react-icons/io";

const Section08 = () => {
  const sliderRef = useRef(null); // Reference to control the slider

  const settings = {
    dots: false,
    infinite: true,
    // speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    arrows: false, // Hide default arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const cards = [
    {
      title: "Youtube services",
      img: "../../Images/about/contentCreator.svg",
    },
    {
      title: "Youtube services",
      img: "../../Images/about/contentCreator.svg",
    },
    {
      title: "Youtube services",
      img: "../../Images/about/contentCreator.svg",
    },
    {
      title: "Youtube services",
      img: "../../Images/about/contentCreator.svg",
    },
  ];

  return (
    <div className="container my-5 position-relative">
      <h2 className="font-weight-bold mb-4">
        Tailored Services for Diverse Content Creators and Platforms
      </h2>

      {/* Custom Buttons */}
      <button
        className="btn btn-light position-absolute top-50 d-none start-0 translate-middle-y"
        style={{ zIndex: 5 }}
        onClick={() => sliderRef.current.slickPrev()}
      >
        {/* <IoIosArrowBack size={30} /> */}
      </button>
      <button
        className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
        style={{ zIndex: 5 }}
        onClick={() => sliderRef.current.slickNext()}
      >
        <IoIosArrowForward size={30} />
      </button>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {cards.map((card, index) => (
          <div key={index} className="p-2">
            <div className="card h-100 position-relative">
              <img src={card.img} className="card-img-top" alt={card.title} />
              <div
                className="card-title-overlay"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {card.title}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Section08;
