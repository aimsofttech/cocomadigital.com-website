import { useState } from "react";
import "./HireingCard.css";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

const HiringCard = ({ itemData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const filteredData = itemData?.pre_launch_activity;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredData.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + filteredData.length) % filteredData.length
    );
  };

  return (
    <div
      className="pre-launched-activity-main-wrapper"
      style={{ background: "#F7F7F7" }}
    >
      <div className="pre-launched-activity-main">
        <h2 className="single-web-series-main-title text-center">
          Pre-Launch Activities
        </h2>
        <div className="pre-launched-activity-content-main">
          {filteredData?.length > 0 ? (
            <div className="pre-launched-activity-content-img-wraper">
              <div className="pre-launched-activity-content-wraper">
                <h2 className="fw-bold">{filteredData[currentIndex]?.title}</h2>
                <p className="pt-3">
                  {filteredData[currentIndex]?.description}
                </p>
              </div>
              <div className="pre-launched-activity-img-wraper">
                <img
                  src={filteredData[currentIndex]?.image}
                  alt={filteredData[currentIndex]?.title}
                  className="img-fluid rounded summary-images"
                />
                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="monthly-performance-left-btn me-3"
                    onClick={handlePrev}
                    aria-label="Previous"
                  >
                    <IoMdArrowBack size={22} />
                  </button>
                  <button
                    className="monthly-performance-right-btn"
                    onClick={handleNext}
                    aria-label="Next"
                  >
                    <IoMdArrowForward size={22} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center">No items available in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HiringCard;
