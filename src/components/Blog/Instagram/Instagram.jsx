import React from "react";
import "./Instagram.css";

const Instagram = ({ title }) => {
  return (
    <div className="blog-insta-main">
      <h1 className="blog-insta-title">{title}</h1>
      <div className="row" style={{ marginRight: "0px" }}>
        {Array.from({ length: 12 }).map((_, index) => {
          return (
            <div key={index} className="col-md-4 col-6 px-1">
              <img
                className="blog-insta-img"
                src="/Images//blog//blog-insta.svg"
                alt="blog-img"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Instagram;
