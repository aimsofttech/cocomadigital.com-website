import React from "react";
import "./PlayBtn.css";
import { FaPlay } from "react-icons/fa";

const PlayBtn = () => {
  return (
    <>
      <div className="play-btn-main">
        <FaPlay className="play-btn-icon" />
      </div>
    </>
  );
};

export default PlayBtn;
