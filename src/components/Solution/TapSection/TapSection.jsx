import React, { useEffect, useState } from "react";
import "./TapSection.css";
import { solutionTapData } from "../../../utils";
import SecondaryLink from "../../common/SecondaryLink/SecondaryLink";

const TapSection = ({ TapData }) => {
  const [activeId, setActiveId] = useState(1);
  const [activeData, setActiveData] = useState();

  useEffect(() => {
    const currentData = solutionTapData?.find((item) => item.id === activeId);
    if (currentData) {
      setActiveData(currentData);
    }
  }, [activeId]);

  return (
    <div className="tap-section">
      <div className="tap-header-container">
        {TapData.map((item, index) => (
          <div
            key={index}
            className={`tap-header ${item.id === activeId ? "tap-active" : ""}`}
            onClick={() => setActiveId(item.id)}
          >
            <div
              className={`mobile-active-bar ${
                item.id === activeId ? "mobile-active-bar-bg" : "black"
              }`}
            ></div>
            <p
              className={`tap-header-title-desktop  tap-header-title ${
                item.id === activeId ? "tap-active" : ""
              }`}
            >
              {item.title}
            </p>
            <p className={`tap-header-title-mobile tap-header-title`}>
              {item?.title.split(" ").map((word, index) => (
                <span key={index}>
                  {word}
                  <br />
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
      <div className="content-image-container">
        <div className="tap-content">
          <h1 className="tap-content-title">{activeData?.title}</h1>
          <p className="tap-content-discription">{activeData?.discription}</p>
          <SecondaryLink
            className="button-title"
            title="Schedule Meeting"
            path="/"
          />
        </div>
        <div className="tap-image">
          <img
            src="/Images/solution/solutionTap1.svg"
            alt={activeData?.title}
          />
        </div>
      </div>
    </div>
  );
};

export default TapSection;
