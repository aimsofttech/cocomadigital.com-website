import "./Section05.css";
import { ADMIN_URL } from "../../../utils";
import EditLink from "../../Edit-Link/Edit-Link";
import { Suspense, lazy, useMemo } from "react";

// Lazy load ReactPlayer for performance
const ReactPlayer = lazy(() => import("react-player"));

const Section05 = ({ VideoData = {} }) => {
  // Memoize video URL to prevent unnecessary re-renders
  const videoUrl = useMemo(() => VideoData?.video_url || "", [VideoData?.video_url]);

  return (
    <div className="home-video-main-wraper">
      <div className="home-video-main">
        <h1 className="home-video-section-title">
          Our Achievement
          <EditLink path={`${ADMIN_URL}/home/video/show/${VideoData?.id}`} />
        </h1>

        <div className="video-wrapper">
          <Suspense fallback={<div style={{ height: "100%", background: "#000" }} />}>
            {videoUrl && (
              <ReactPlayer
                url={videoUrl}
                playing
                loop
                muted
                controls={false}
                width="100%"
                height="100%"
                playsinline
                config={{
                  file: { attributes: { preload: "none" } },
                }}
              />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Section05;
