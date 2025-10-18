import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import axios from "axios";

const Slider07 = () => {
  const [successStories, setSuccessStories] = useState([]); // State to hold API data
  const sliderRef = useRef(null); // Reference to control the slider

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
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
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Fetch success stories from the API
  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const response = await axios.get(
          "https://admin.cocomadigital.com/public/api/success_stories"
        );
        if (response.data.status === "success") {
          setSuccessStories(response.data.data.success_stories);
        }
      } catch (error) {
        console.error("Error fetching success stories:", error);
      }
    };

    fetchSuccessStories();
  }, []);

  return (
    <div className="container my-5 position-relative">
      <h2 className="font-weight-bold mb-4">Youtube SUCCESS STORIES</h2>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {successStories.map((story) => (
          <div key={story.id} className="p-2">
            <div className="success-stories-card h-100">
              <img
                src="../../Images/about/upperDots.svg"
                className="upperDots position-absolute"
                alt="upper dots"
              />
              <h2 className="card-title p-3">{story.success_stories_title}</h2>

              <img
                src={story.success_stories_img}
                className="success-stories-card-img-top p-3"
                alt={story.success_stories_title}
                width={"100%"}
              />
              {/* <div className="card-body">
                {story.success_stories_description}
                <br />
                <u>See More</u>
              </div> */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Slider07;
