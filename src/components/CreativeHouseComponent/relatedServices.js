import React, { useRef } from "react";
import Slider from "react-slick";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const RelatedServicesSlider = ({ Haddertitle }) => {
  const sliderRef = useRef(null); // Reference to control the slider
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
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
      title: "Movies marketing",
      img: "../../Images/relatedservices.svg",
    },
    {
      title: "Documentry marketing",
      img: "../../Images/relatedservices.svg",
    },
    {
      title: "Podcast marketing",
      img: "../../Images/relatedservices.svg",
    },
    {
      title: "songs marketing",
      img: "../../Images/relatedservices.svg",
    },
  ];

  return (
    <div className="container my-5 position-relative">
      <h1 className="fw-bold text-center mb-4">{Haddertitle}</h1>
      <button
        className="btn relatedservices-slider-button position-absolute top-50 start-0 translate-middle-y"
        style={{ zIndex: 5 }}
        onClick={() => sliderRef.current.slickPrev()}
      >
        <IoIosArrowBack size={30} />
      </button>
      <button
        className="btn relatedservices-slider-button position-absolute top-50 end-0 translate-middle-y"
        style={{ zIndex: 5 }}
        onClick={() => sliderRef.current.slickNext()}
      >
        <IoIosArrowForward size={30} />
      </button>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {cards.map((card, index) => (
          <div key={index} className="p-2">
            <div className=" h-100">
              <img src={card.img} className="card-img-top" alt={card.title} />
              <div className="card-body ">
                <h5 className="card-title">{card.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RelatedServicesSlider;
