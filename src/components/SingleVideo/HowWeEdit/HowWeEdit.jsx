import { useState } from "react";
import "./HowWeEdit.css";
import PlayBtn from "../../common/PlayBtn/PlayBtn";
import ReactPlayer from "react-player";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

export default function HowWeEdit({ data }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Handler to play the video
  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="single-video-how-to-edit-main edit-bg">
      <h1 className="single-video-how-to-edit-title">
        {data?.title}
        <EditLink
          path={`${ADMIN_URL}/home/creative_house/creative_house_item/show/${data?.id}`} />
      </h1>
      <div className="single-video-image-container">
        {!isPlaying && (
          <div className="position-relative">
            <img
              src={
                data?.thumbnail ??
                "../../Images/VideoEditing.svg"
              }
              alt="Video Thumbnail"
              className="img-fluid rounded"
            />
            {/* Play Button */}
            {(data?.upload_video ||
              data?.video_url) && (
              <button
                className="position-absolute single-video-how-to-edit-play-btn"
                onClick={handlePlay}
              >
                <PlayBtn />
              </button>
            )}
          </div>
        )}
        {isPlaying && (
          <div
            className="video-container"
            style={{ position: "relative", paddingTop: "56.25%" }}
          >
            <ReactPlayer
              url={
                data?.upload_video
                  ? data?.upload_video
                  : data?.video_url
              }
              controls
              playing={true}
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
