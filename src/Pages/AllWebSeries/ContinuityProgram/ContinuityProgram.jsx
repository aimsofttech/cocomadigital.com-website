import { useEffect, useState } from "react";
import "./ContinuityProgram.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import ReactPlayer from "react-player";
import PlayBtn from "../../../components/common/PlayBtn/PlayBtn";
import adminServiceInstance from "../../../Service/apiService";

const ContinuityProgram = ({ itemData }) => {
  const [activeCategory, setActiveCategory] = useState(
    itemData?.continuity_category[0]
  );
  const [activeData, setActiveData] = useState([]);
  const [readMoreText, setReadMoreText] = useState(false);
  const [videoToPlay, setVideoToPlay] = useState(null);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const fetchContinuityProgram = async () => {
      try {
        const params = {
          marketing_house_item_id: activeCategory?.marketing_house_item_id,
          category_id: activeCategory?.id,
        }
        const response = await adminServiceInstance?.ContinuityProgram(params);
        setActiveData(response?.data?.data)
      } catch (err) {
        console.error("Error fetching group services:", err);
      }
    };

    fetchContinuityProgram();
  }, [activeCategory]);



  const CustomPrevArrow = ({ className, style, onClick }) => (
    <div
      className={`${className} service-scroll-button left`}
      onClick={onClick}
    >
      <FaChevronLeft size={20} color="#000" />
    </div>
  );

  const CustomNextArrow = ({ className, style, onClick }) => (
    <div
      className={`${className} service-scroll-button right`}
      onClick={onClick}
    >
      <FaChevronRight size={20} color="#000" />
    </div>
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          // infinite: true,
          // dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 0,
        },
      },
    ],
  };

  return (
    <div className="web-series-continuity-program-main-wrapper">
      <div className="web-series-continuity-program-main">
        <h1 className="single-web-series-main-title text-center">
          Continuity Program
        </h1>
        <div className="web-series-continuity-program-category-wrapper">
          {itemData?.continuity_category?.map((item, index) => {
            return (
              <p
                key={index}
                className={`text-center web-series-continuity-program-category-item ${
                  activeCategory?.id === item?.id
                    ? "btn-warning text-dark"
                    : "btn-light"
                }`}
                onClick={() =>
                  setActiveCategory(item)
                }
              >
                {item?.category_name}
              </p>
            );
          })}
        </div>
        <div className="w-100 web-series-continuity-program-desc">
          <p>
            {!readMoreText ? (
              <span className="web-series-continuity-program-desc-sort">
                {activeCategory?.description?.slice(
                  0,
                  400
                )}
                {activeCategory?.description?.length >
                  400 && "..."}
              </span>
            ) : (
              <span className="web-series-continuity-program-desc-total">
                {activeCategory?.description}
              </span>
            )}
            {activeCategory?.description?.length >
              400 && (
              <span
                className="web-series-continuity-program-desc-read-more"
                onClick={() => setReadMoreText(!readMoreText)}
              >
                {readMoreText ? "ReadLess" : "ReadMore"}
              </span>
            )}
          </p>
        </div>

        {/* Slider */}
        {activeData?.length > 0 && (
          <div className="web-series-continuity-program-slide-card-wrapper">
            <Slider {...settings}>
              {activeData?.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setVideoToPlay({
                        url: item?.upload_video
                          ? item?.upload_video
                          : item?.community_program_item_video_url,
                        title: activeCategory?.category_name,
                        VideoId: item?.id,
                      });
                      setShowModal(true);
                    }}
                    className="w-100 web-series-continuity-program-slide-card"
                  >
                    <div className="w-100 position-relative">
                      <img
                        className="w-full h-auto object-cover"
                        src={item?.thumbnail}
                        alt="category"
                      />
                      <PlayBtn />
                    </div>
                    <p className="card-title mt-2">
                      {item?.community_program_item_description}
                    </p>
                  </div>
                );
              })}
            </Slider>
          </div>
        )}

        {activeData?.length === 0 && (
          <div
            style={{ height: "50px" }}
            className="w-100 d-flex justify-content-between align-content-center"
          >
            <h5 style={{ fontWeight: 600 }} className="w-100 text-center">
              Videos Not Available
            </h5>
          </div>
        )}
      </div>

      {/* <<---------------video Modal------------->> */}
      {videoToPlay && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          backdrop="static"
          size="lg"
          className="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <strong>{videoToPlay?.title}</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div
              className="video-container"
              style={{ position: "relative", paddingTop: "56.25%" }}
            >
              <ReactPlayer
                url={videoToPlay?.url}
                controls
                playing={true}
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            </div>
          </Modal.Body>
          {/* <Modal.Footer style={{ background: "white" }}>
            <Link to={`/Single-Video/${videoToPlay.VideoId}`}>
              <button className="btn btn-warning">See How We Edit</button>
            </Link>
            <Link to={`/ScheduleMeeting`}>
              <button className="btn btn-light">Book A Demo Call</button>
            </Link>
          </Modal.Footer> */}
        </Modal>
      )}
    </div>
  );
};

export default ContinuityProgram;
