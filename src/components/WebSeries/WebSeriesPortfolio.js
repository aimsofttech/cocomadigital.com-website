import { useState } from "react";
import PlayBtn from "../common/PlayBtn/PlayBtn";

export default function AllWebSeries() {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText =
    "Lorem ipsum dolor sit amet consectetur. Faucibus nulla habitant condimentum neque placerat volutpat laoreet ultrices pharetra. Additional text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel lectus libero. Sed venenatis, ipsum sit amet gravida aliquam, purus justo laoreet dolor, et fermentum enim erat eu arcu.";

  // Function to truncate text
  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) return text;
    return text?.slice(0, maxLength) + "...";
  };

  // Text to display
  const visibleText = isExpanded ? fullText : truncateText(fullText, 200);

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-6 col-md-6 order-lg-1 order-2 order-md-2">
            <div className="d-flex align-items-center justify-content-between mb-5">
              <h1 className="fw-bold display-4">2024</h1>
              <select className="form-select w-25" aria-label="Select Filter">
                <option value="All" defaultValue>
                  All
                </option>
                <option value="Campaigns">Campaigns</option>
                <option value="Projects">Projects</option>
              </select>
            </div>
            <div className=" mt-5">
              <h5 className="mt-5">
                Innovative digital marketing that drove results across social
                media and streaming platforms.
              </h5>
              <p className="mt-5">
                {visibleText}
                <span
                  className="fw-bold ms-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? "See Less" : "See More"}
                </span>
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-6 mb-4 order-1 order-lg-2 order-md-2 position-relative text-center">
            <div className="position-relative">
              <img
                src="../../Images/AllWebSerise.svg"
                alt="Project Poster"
                className="img-fluid rounded shadow-sm"
              />
              <div className="position-absolute top-50 start-50 translate-middle">
                <PlayBtn />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
