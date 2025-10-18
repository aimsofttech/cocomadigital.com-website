import { useState, useRef, useEffect } from "react";
import "./OtherActivities.css";
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import adminServiceInstance from "../../../Service/apiService";

const OtherActivities = ({ itemData }) => {
  const [activeCategory, setActiveCategory] = useState(
    itemData?.other_activity_category[0] || {}
  );
  const [otherActivity, setOtherActivity] = useState([]);
  const sliderRef = useRef(null);


  useEffect(() => {
    const fetchOtherActivity = async () => {
      try {
        const params = {
          marketing_house_item_id: activeCategory?.marketing_house_item_id,
          category_id: activeCategory?.id,
        }
        const response = await adminServiceInstance?.OtherActivities(params);
        setOtherActivity(response?.data?.data);
      } catch (err) {
        console.error("Error fetching group services:", err);
      }
    };

    if (activeCategory) {
      fetchOtherActivity();
    }
  }, [activeCategory]);


  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="other-activity-main-wraper">
      <div className="other-activity-main">
        {/* Header */}
        <h2 className="text-center single-web-series-main-title fw-bold">
          Other Activities
        </h2>

        {/* Filter Buttons */}
        <div className="d-flex justify-content-center other-activity-header-wraper">
          {itemData?.other_activity_category?.map((item, index) => (
            <button
              key={index}
              className={`btn me-2 other-activity-header-btn ${activeCategory?.id === item?.id
                  ? "btn-outline-light"
                  : "btn-outline-secondary"
                }`}
              onClick={() => {
                setActiveCategory(item);
              }}
            >
              {item?.category_name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="other-activity-content-slider-wraper">
          {/* Text Content */}

          <div className="other-activity-content-wraper">
            {otherActivity?.length > 0 ? (
              <div>
                <h3 className="other-activity-content-title">
                  {otherActivity[0]?.title}
                </h3>
                <p className="other-activity-content-discription">
                  {otherActivity[0]?.description}
                </p>
              </div>
            ) : (
              <div className="">
                <p className="text-center">
                  No items available for this category.
                </p>
              </div>
            )}
          </div>

          {/* Image Slider */}
          <div className="other-activity-slider-wraper position-relative">
            <Slider {...sliderSettings} ref={sliderRef}>
              {otherActivity?.map((item) => {
                const images = [
                  item?.image1,
                  item?.image2,
                  item?.image3,
                  item?.image4,
                ]?.filter(Boolean); // Filter out undefined/null images
                return images?.map((image, i) => (
                  <div key={`${item?.id}-${i}`}>
                    <img
                      src={image}
                      alt={`Slide ${i + 1}`}
                      className="other-activity-slider-images"
                    />
                  </div>
                ));
              })}
            </Slider>
            <button
              className="position-absolute other-activity-button-prev-btn start-0 translate-middle-y"
              style={{ zIndex: 5 }}
              onClick={() => sliderRef.current.slickPrev()}
            >
              <IoIosArrowBack size={30} />
            </button>
            <button
              className="position-absolute other-activity-button-next-btn end-0 translate-middle-y"
              style={{ zIndex: 5 }}
              onClick={() => sliderRef.current.slickNext()}
            >
              <IoIosArrowForward size={30} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OtherActivities;
