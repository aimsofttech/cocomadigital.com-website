import "./VideoEditingServices.css";
import ServiceSlider from "../../common/ServiceSlider/ServiceSlider";

const VideoEditingServices = ({ otherServices }) => {

  return (
    <div className="service-page-video-edit-service-main-wrapper">
      <div className="service-page-video-edit-service-main my-5">
        <h2 className="fw-bold mb-4 text-uppercase service-page-video-edit-service-title">
          Other Video Editing Services
        </h2>
        <ServiceSlider data={otherServices} />
      </div>
    </div>
  );
};

export default VideoEditingServices;
