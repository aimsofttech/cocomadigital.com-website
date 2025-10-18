import React, { useRef } from "react";
import Slider from "react-slick";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const Section06 = () => {
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
      title: "Channel Audit & Analysis",
      img: "../../Images/about/youtube-channel.svg",
    },
    {
      title: "Channel Branding & Design",
      img: "../../Images/about/youtube-channel.svg",
    },
    {
      title: "Metadata Optimization",
      img: "../../Images/about/youtube-channel.svg",
    },
    {
      title: "SEO & Keyword Research",
      img: "../../Images/about/youtube-channel.svg",
    },
  ];

  return (
    <div className="container my-5 position-relative">
      <h2 className="font-weight-bold mb-4">YouTube Video Editing Services</h2>

      {/* Custom Buttons */}
      <button
        className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
        style={{ zIndex: 5 }}
        onClick={() => sliderRef.current.slickPrev()}
      >
        <IoIosArrowBack size={30} />
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
            <div className="card h-100">
              <img src={card.img} className="card-img-top" alt={card.title} />
              <div className="card-body text-center">
                <h5 className="card-title">{card.title}</h5>
                <button className="btn btn-dark">Add</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Section06;
