import { useState } from "react";
import "./SingleWebSeriesData.css";
import ReactPlayer from "react-player";
import { Modal } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import AuthorInfo from "../../common/authorInfo/authorInfo";
import PlayBtn from "../../common/PlayBtn/PlayBtn";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

export default function SingleWebSeriesData({ itemData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handlePlayVideo = (videoUrl) => {
    setVideoUrl(videoUrl);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="single-web-series-main-wraper">
        <div className="single-web-series-main">
          {/* Movie Header */}
          <h2 className="single-web-series-main-title">
            {itemData?.title} ({itemData?.year})
          </h2>
          {/* <p>YouTube Marketing</p> */}
          <AuthorInfo autherId={itemData?.author_id} />

          <div className="single-web-series-second-row-content-slider-wraper">
            <div className="single-web-series-second-row-content-wraper">
              <p>
                <strong>Client : </strong>{" "}
                <span className="key-value">{itemData?.client}</span>
              </p>
              <p>
                <strong>Genre : </strong>{" "}
                <span className="key-value">{itemData?.genre}</span>
              </p>
              <p>
                <strong>Cast : </strong>{" "}
                <span className="key-value">{itemData?.cast}</span>
              </p>
              <p>
                <strong>Directors : </strong>{" "}
                <span className="key-value">
                  {itemData?.directors ? itemData?.directors : "NA"}
                </span>
              </p>
              <p>
                <strong>Year : </strong>{" "}
                <span className="key-value">{itemData?.year}</span>
              </p>
              <p
                style={{ color: "#C1C1C1" }}
              >
                {itemData?.description}
                <EditLink
                  path={`${ADMIN_URL}/home/marketing/marketing_house_item/show/${itemData?.id}`}
                />
              </p>
            </div>

            {/* Image Slider */}
            <div className="single-web-series-second-row-slider-wraper">
              {itemData?.images && itemData?.images?.length > 0 ? (
                <>
                  <Carousel
                    indicators={true}
                    arrows={false}
                    controls={true}
                    interval={3000}
                  >
                    {itemData?.images?.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          src={image?.image}
                          alt={`Slide ${index + 1}`}
                          className="d-block w-100 img-fluid"
                        />
                        {(image?.upload_video ||
                          image?.video_url) && (
                            <button
                              className="sevice-details-banner-card-play-button"
                              onClick={() =>
                                handlePlayVideo(
                                  image?.upload_video
                                    ? image?.upload_video
                                    : image?.video_url
                                )
                              }
                            >
                              <PlayBtn />
                            </button>
                          )}
                      </Carousel.Item>
                    ))}
                  </Carousel>
                    <EditLink
                      path={`${ADMIN_URL}/marketing_house/marketing_house_image/${itemData?.id}`}
                    />
                </>
              ) : (
                <p className="w-100 text-center">No images available</p>
              )}
            </div>

          </div>

          {/* React Bootstrap Modal */}
          <Modal
            show={isModalOpen}
            onHide={() => setIsModalOpen(false)}
            centered
            size="lg"
            style={{ zIndex: 9999 }}
          >
            <Modal.Header
              style={{ background: "white" }}
              closeButton
            ></Modal.Header>
            <Modal.Body style={{ background: "white", height: "70vh" }}>
              <ReactPlayer
                url={videoUrl}
                controls
                playing
                width="100%"
                height="100%"
              />
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
}
