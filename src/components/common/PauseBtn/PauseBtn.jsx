import React from "react";
import "./PauseBtn.css";
import { FaPause } from "react-icons/fa";

const PauseBtn = () => {
  return (
    <>
      <div className="pause-btn-main">
        <FaPause className="pause-btn-icon" />
      </div>
    </>
  );
};

export default PauseBtn;
