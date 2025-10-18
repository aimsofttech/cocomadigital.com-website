import React from "react";
import "./TopPost.css";

const TopPostData = [
  {
    id: 1,
    title: "The Importance of UI/UX Design",
    desc: "Design - Nov 17 , 2024",
  },
  {
    id: 2,
    title: "The Importance of UI/UX Design",
    desc: "Design - Nov 17 , 2024",
  },
  {
    id: 3,
    title: "The Importance of UI/UX Design",
    desc: "Design - Nov 17 , 2024",
  },
  {
    id: 4,
    title: "The Importance of UI/UX Design",
    desc: "Design - Nov 17 , 2024",
  },
  {
    id: 5,
    title: "The Importance of UI/UX Design",
    desc: "Design - Nov 17 , 2024",
  },
];

const TopPost = () => {
  return (
    <div className="top-post-main">
      <h1 className="top-post-title">Top Posts</h1>
      {TopPostData.map((item, index) => {
        return (
          <div key={index} className="top-post-content-wrapper">
            <h1>0{item?.id}</h1>
            <div className="top-post-dis-date-wrapper">
              <h2>{item?.title}</h2>
              <p>{item?.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopPost;
