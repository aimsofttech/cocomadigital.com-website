import { useState, useRef } from "react";
import "./FinalOutput.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PlayBtn from "../../common/PlayBtn/PlayBtn";
import ReactPlayer from "react-player";

const VideoSlider = ({ FinalOutputData }) => {
  const sliderRef = useRef(null);
  const sliderContent = FinalOutputData?.creative_house_final_output || [];
  // Initialize current video and thumbnail from sliderContent
  const [currentVideo, setCurrentVideo] = useState(
    sliderContent[0]?.video_url || ""
  );
  const [currentThumbnail, setCurrentThumbnail] = useState(
    sliderContent[0]?.thumbnail || ""
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const handleThumbnailClick = (
    video_url,
    thumbnail
  ) => {
    setCurrentVideo(video_url);
    setCurrentThumbnail(thumbnail);
    setIsPlaying(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 3000,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-dark text-white single-video-page-final-output-main-wraper">
      <div className="single-video-page-final-output-main">
        <h2 className="text-center single-video-how-to-edit-title ">
          Project Media
        </h2>
        {/* Large Video Section */}
        <div
          className="position-relative mx-auto my-4"
          style={{ maxWidth: "900px" }}
        >
          {isPlaying && (
            <ReactPlayer
              url={currentVideo}
              controls
              playing
              width="100%"
              height="100%"
              onEnded={handleVideoEnd}
            />
          )}
          {!isPlaying && (
            <div className="position-relative">
              <img
                src={currentThumbnail}
                alt="Current thumbnail"
                className="img-fluid w-100 rounded"
              />
              <div onClick={() => setIsPlaying(true)}>
                <PlayBtn />
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Slider */}
        <div>
          <Slider {...settings} ref={sliderRef}>
            {sliderContent?.map((video) => (
              <div key={video?.id} className="px-2">
                <div
                  className="position-relative"
                  onClick={() => {
                    const videoSrc = video?.upload_video || video?.video_url;
                    handleThumbnailClick(videoSrc, video?.thumbnail);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={video?.thumbnail}
                    alt={video?.title}
                    className="final-output-slider-images"
                  />
                  {(video?.upload_video ||
                    video?.video_url) && <PlayBtn />}
                </div>
                <p className="text-center mt-2">{video?.title}</p>
              </div>
            ))}
          </Slider>{" "}
        </div>
      </div>
    </div>
  );
};

export default VideoSlider;
