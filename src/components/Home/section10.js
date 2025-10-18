import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Section10 = ({ DevelopmentHouseData }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (DevelopmentHouseData?.development_house) {
      const allCategories = [
        "All",
        ...DevelopmentHouseData.development_house.map(
          (cat) => cat.development_house_category_name
        ),
      ];
      setCategories(allCategories);
      setFilteredItems(DevelopmentHouseData.development_house);
    }
  }, [DevelopmentHouseData]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(DevelopmentHouseData.development_house);
    } else {
      const categoryData = DevelopmentHouseData.development_house.find(
        (cat) => cat.development_house_category_name === selectedCategory
      );
      setFilteredItems(categoryData ? [categoryData] : []);
    }
  }, [selectedCategory, DevelopmentHouseData]);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="container my-5">
      <h2 className="fw-bold">LATEST WORK FROM</h2>
      <h3 className="fw-bold">OUR DEVELOPMENT HOUSE</h3>

      <Slider {...sliderSettings} className="SliderCustom-width">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`cat-filter-button btn w-auto ${
              selectedCategory === category
                ? "btn-warning"
                : "btn-outline-secondary"
            } my-1 me-2`}
          >
            {category}
          </button>
        ))}
      </Slider>

      <div className="row mt-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((category) =>
            category.items.length > 0
              ? category.items.map((item) => (
                  <div key={item.id} className="col-md-4 col-sm-6 col-12 mb-4">
                    <div className="card h-100">
                      <img
                        src={item.development_house_img}
                        className="card-img-top"
                        alt="Development Work"
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title">Development Work</h5>
                        <a
                          href={item.development_house_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-dark"
                        >
                          Explore Now <i className="bi bi-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              : null
          )
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">No items available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Section10;
