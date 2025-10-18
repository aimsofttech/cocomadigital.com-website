import { useState, useRef } from "react";
import Slider from "react-slick";
import "./CreativeSlider.css";
import { FaArrowRight } from "react-icons/fa";
import ReactPlayer from "react-player";
import { FaArrowLeft } from "react-icons/fa";
import PlayBtn from "../../common/PlayBtn/PlayBtn";

const CreativeSlider = ({ CreativeSliderData }) => {
  const sliderRef = useRef(null);
  const [playingVideo, setPlayingVideo] = useState(false);

  const videosPlayBtnHandler = () => {
    setPlayingVideo(true);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,

    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Use creative_house_approach data
  const sliderContent = CreativeSliderData || [];

  return (
    <div className="creative-approach-bg single-video-creative-slid">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h1 className="text-center fw-bold mb-sm-4 mb-3 single-video-how-to-edit-title">
              Creative Approach
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-8 col-sm-10 col-12 m-auto p-0">
            <Slider {...settings} ref={sliderRef}>
              {sliderContent?.map((item, index) => (
                <div key={index} className="">
                  <div className="slider-image-wrapper position-relative mb-3">
                    {playingVideo && (
                      <ReactPlayer
                        url={
                          item?.upload_video
                            ? item?.upload_video
                            : item?.video_url
                        }
                        playing={true}
                        controls={true}
                        width="100%"
                        height="400px"
                      />
                    )}
                    {!playingVideo && (
                      <>
                        <img
                          src={item?.thumbnail}
                          alt={item?.heading}
                          className=""
                          style={{
                            width: "100%",
                            maxHeight: "400px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        {(item?.upload_video ||
                          item?.video_url) && (
                          <button
                            className="single-video-creative-slid-play-btn"
                            onClick={videosPlayBtnHandler}
                          >
                            <PlayBtn />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="single-video-creative-approach-content-wraper">
                    <div className="single-video-creative-approach-counter-title-wraper">
                      <h1 className="single-video-creative-approach-counter">
                        {index + 1}
                      </h1>
                      <h4 className="single-video-creative-approach-title">
                        {item?.heading}
                      </h4>
                    </div>
                    <p className="single-video-creative-approach-discription">
                      {item?.description}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <div className="col-lg-12 text-end position-relative">
            <button
              className="btn btn-dark creative-approach-arrow-button translate-middle-y"
              style={{ zIndex: 5 }}
              onClick={() => sliderRef.current.slickPrev()}
            >
              <FaArrowLeft size={25} />
            </button>
            <button
              className="btn btn-light creative-approach-arrow-button translate-middle-y"
              style={{ zIndex: 5 }}
              onClick={() => sliderRef.current.slickNext()}
            >
              <FaArrowRight size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeSlider;
