import React, { useState } from "react";
import "./RecentWork.css";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ReactPlayer from "react-player";
import PlayBtn from "../../common/PlayBtn/PlayBtn";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const RecentlyWorkedWith = ({ RecentWorkData }) => {
  const videoData = RecentWorkData || [];
  const sliderRef = React.useRef(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="recent-wrk-main-wraper">
      <div className="recent-wrk-main">
        <h2 className="fw-bold text-uppercase mb-4 service-page-video-edit-service-title">
          Recently Worked With
        </h2>
        <div className="w-100 position-relative">
          <button
            className="service-scroll-button left"
            onClick={() => sliderRef.current.slickPrev()}
          >
            <FaChevronLeft size={22} />
          </button>
          <Slider ref={sliderRef} {...settings}>
            {videoData?.map((item) => (
              <div key={item.id} className="px-sm-2 px-1 card-trasnlate">
                <div className="position-relative">
                  {playingVideo === item?.id ? (
                    <div
                      className="video-container"
                      style={{ position: "relative", paddingTop: "70%" }}
                    >
                      <ReactPlayer
                        url={item?.video_url}
                        controls
                        playing={true}
                        width="100%"
                        height="100%"
                        style={{ position: "absolute", top: 0, left: 0 }}
                      />
                    </div>
                  ) : (
                    <div
                      className="position-relative"
                      onClick={() => setPlayingVideo(item?.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={item?.thumbnail}
                        alt="Video Thumbnail"
                        className="img-fluid rounded w-100"
                      />
                      <PlayBtn />
                    </div>
                  )}
                  <div className="position-absolute top-0 end-0 me-2 mt-2">
                    <EditLink
                      path={`${ADMIN_URL}/home/group/service/group_single_service_recent_work/show/${item?.id}/${item?.group_service_item_id}`} />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          <button
            className="service-scroll-button right"
            onClick={() => sliderRef.current.slickNext()}
          >
            <FaChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentlyWorkedWith;
