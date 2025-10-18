import { useEffect, useState } from "react";
import "./ContentCreateByTeam.css";
import ReactPlayer from "react-player";
import { FcGallery } from "react-icons/fc";
import { FaEye } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import AdminService from "../../../Service/apiService";
import PlayBtn from "../../common/PlayBtn/PlayBtn";
import PauseBtn from "../../common/PauseBtn/PauseBtn";
import adminServiceInstance from "../../../Service/apiService";
const ITEMS_PER_PAGE = 6;

const ContentCreateByTeam = ({ itemData }) => {
  const [activeCategory, setActiveCategory] = useState(itemData?.content_created_category[0])
  const [contentCreated, setContentCreated] = useState([]);
  const [carouselsData, setCarouselsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [galleryData, setGalleryData] = useState([]);
  const [showModal, setShowModal] = useState(false);


  // Fetch Marketing Content Created Data accept Carousels
  useEffect(() => {
    const fetchMarketingContentCreated = async () => {
      try {
        const params = {
          marketing_house_item_id: activeCategory?.marketing_house_item_id,
          category_id: activeCategory?.id
        }
        const response = await adminServiceInstance?.MarketingContentCreated(params);
        setContentCreated(response?.data?.data)
      } catch (err) {
        console.error("Error fetching group services:", err);
      }
    };

    if (activeCategory?.category_name !== "Carousels") {
      fetchMarketingContentCreated();
    }
  }, [activeCategory]);


  // Fetch Marketing Content Created Data for Carousels tabs
  useEffect(() => {
    const fetchMarketingContentCreatedCarousels = async () => {
      try {
        const params = {
          marketing_house_item_id: activeCategory?.marketing_house_item_id,
          category_id: activeCategory?.id
        }
        const response = await adminServiceInstance?.MarketingContentCreatedCarousels(params);
        setCarouselsData(response?.data?.data?.carousalData);
      } catch (err) {
        console.error("Error fetching group services:", err);
      }
    };

    if (activeCategory?.category_name === "Carousels") {
      fetchMarketingContentCreatedCarousels();
    }
  }, [activeCategory]);


  // Handle Play
  const handlePlay = (id) => {
    setPlayingVideo(id);
  };

  // Handle Pause
  const handlePause = (id) => {
    if (playingVideo === id) {
      setPlayingVideo(null);
    }
  };

  const galleryImagesViewHandler = async (marketingHouseId, carouselId) => {
    if (carouselId && marketingHouseId) {
      try {
        const response = await AdminService?.marketingHouseContentGallery({
          marketing_house_item_id: marketingHouseId,
          carousel_order: carouselId,
        });
        if (response?.data?.data?.carousalData) {
          setGalleryData(response?.data?.data?.carousalData);
          setShowModal(true);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <div className="marketing-details-content-creator-main-wraper">
      <div className="marketing-details-content-creator-main">
        <h2 className="text-center single-web-series-main-title">
          Content Created By Our Team
        </h2>
        {/* Filter Buttons */}
        <div className="marketing-details-content-creator-category-wraper">
          {itemData?.content_created_category?.slice(0, 4)?.map((category) => (
            <button
              key={category?.id}
              className={`marketing-details-content-created-by-team-button ${activeCategory?.id === category?.id
                ? "btn-warning text-dark"
                : "btn-light"
                }`}
              onClick={() => {
                setActiveCategory(category)
                setCurrentPage(1);
                setPlayingVideo(null);
              }}
            >
              {category?.category_name}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="marketing-details-content-created-by-cards-wraper">
          <div className="row">
            {activeCategory?.category_name !== "Carousels" && contentCreated?.map((item) => (
              <div
                className="col-6 col-lg-4 col-md-4 marketing-details-content-created-by-cards"
                key={item?.id}
              >
                <div className="position-relative video-wrapper">
                  {playingVideo === item?.id ? (
                    <div className="play-overlay">
                      <ReactPlayer
                        url={item?.url}
                        playing={true}
                        controls={true}
                        className="img-fluid w-100 rounded"
                        width="100%"
                        onEnded={() => setPlayingVideo(null)}
                      />
                      <div onClick={() => handlePause(item?.id)}>
                        <PauseBtn />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="play-overlay"
                      onClick={() => handlePlay(item?.id)}
                    >
                      <img
                        src={item?.image}
                        alt="Thumbnail"
                        className="img-fluid w-100 rounded"
                      />
                      <PlayBtn />
                    </div>
                  )
                  }
                </div>
              </div>
            ))}

            {/* Data for Carousels */}
            {activeCategory?.category_name === "Carousels" &&
              carouselsData?.map((item, index) => (
                <div
                  key={index}
                  className="col-6 col-lg-4 col-md-4 marketing-details-content-created-by-cards marketing-details-content-creator-carousels-img-wraper"
                  onClick={() =>
                    galleryImagesViewHandler(
                      item?.marketing_house_item_id,
                      item?.carousel_order
                    )
                  }
                >
                  <img
                    src={item?.image}
                    alt="Content"
                    className="Carousels-images"
                  />
                  <div className="marketing-details-content-creator-carousels-overlay">
                    <FaEye className="view-gallery-icon" size={20} />
                    <p>View All Gallery Images</p>
                  </div>
                  <div className="marketing-details-content-creator-carousels-gallery-icon">
                    <FcGallery />
                  </div>
                </div>
              ))}

          </div>
        </div>

        {/* Pagination */}
        {/* <div className="d-flex justify-content-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`btn mx-1 ${
                currentPage === index + 1 ? "btn-dark text-white" : "btn-light"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div> */}
      </div>

      {/* <!-- Modal --> */}
      {showModal && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          backdrop="static"
          size="xl"
          className="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <strong>Gallery Images</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            className="w-100 pb-sm-3 pb-2 pt-0"
            style={{ backgroundColor: "white" }}
          >
            <div className="marketing-details-content-creator-gallery-wraper">
              {galleryData?.length > 0 && (
                <div className="row">
                  {galleryData?.map((item, index) => (
                    <div
                      key={index}
                      className="col-6 col-md-4 px-1 mt-2 rounded"
                    >
                      <img
                        className="Carousels-images rounded img-fluid"
                        style={{ height: "auto" }}
                        src={item?.image}
                        alt="card-image"
                      />
                    </div>
                  ))}
                </div>
              )}
              {galleryData?.length === 0 && (
                <div className="d-flex w-100 justify-content-between align-content-center">
                  <h5 className="w-100 text-center">
                    Gallery Images not Available
                  </h5>
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default ContentCreateByTeam;
