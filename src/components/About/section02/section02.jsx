import React from "react";
import "./section02.css";
import { FaSearch } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { BsPersonVideo2 } from "react-icons/bs";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { LuArrowBigRight } from "react-icons/lu";
import { useMediaQuery } from "react-responsive";

const Section09 = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 500px)",
  });

  const steps = [
    {
      number: "1",
      title: "Explore Our Services",
      icon: <FaSearch className="service-page-how-it-work-card-icon" />,
    },
    {
      number: "2",
      title: "Add Suitable Services",
      icon: <FiShoppingBag className="service-page-how-it-work-card-icon" />,
    },
    {
      number: "3",
      title: "Schedule Meeting",
      icon: <BsPersonVideo2 className="service-page-how-it-work-card-icon" />,
    },
    {
      number: "4",
      title: "Start The Project",
      icon: (
        <AiOutlinePlayCircle className="service-page-how-it-work-card-icon" />
      ),
    },
  ];

  return (
    <div className="service-page-how-it-work-main-wraper">
      <div className="service-page-how-it-work-main">
        <h2 className="w-100 text-uppercase service-page-how-it-work-main-title">
          How it work?
        </h2>

        {!isMobile && (
          <div className="service-page-how-it-work-card-wraper">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="service-page-how-it-work-card">
                  <div className="service-page-how-it-work-card-counter">
                    <h1>{step.number}</h1>
                  </div>
                  <div className="service-page-how-it-work-card-icon-title-wraper">
                    <div className="service-page-how-it-work-card-icon-wraper">
                      {step.icon}
                    </div>
                    <p className="service-page-how-it-work-card-title">
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  // <div
                  //   className="d-none d-md-flex align-items-center"
                  //   style={{ margin: "0 10px" }}
                  // >
                  <LuArrowBigRight className="service-page-how-it-work-card-arrow-icon" />
                  // </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {isMobile && (
          <div
            className="d-flex flex-wrap justify-content-center align-items-center p-3"
            style={{
              backgroundColor: "#FFC107",
              borderRadius: "10px",
            }}
          >
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className="text-center mx-3 mb-3"
                  style={{ minWidth: "150px", flex: "1" }}
                >
                  <div className="mobile-hows-it-work-count">{step.number}</div>
                  <div className="mb-2 mt-5">{step.icon}</div>
                  <p style={{ fontWeight: "bolder" }}>{step.title}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Section09;
