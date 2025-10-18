import { useEffect, useRef, useState } from "react";
import "./SingleServiceSlider.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  removeItemFromCart,
} from "../../../Service/redux/cartSlice";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import { Modal } from "react-bootstrap";
import PlayBtn from "../../common/PlayBtn/PlayBtn";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";
import { Link } from "react-router-dom";

const SingleServiceSlider = ({ service }) => {
  const [sliderId, setSliderId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("One Time Only");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const descRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [viewAllLines, setViewAllLines] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const isItemInCart = (itemId) => {
    return cartItems?.some((cartItem) => cartItem?.id === itemId);
  };

  const handleToggleCart = (item) => {
    if (isItemInCart(item?.id)) {
      dispatch(removeItemFromCart(item?.id));
    } else {
      const itemWithCategory = {
        ...item,
        subscriptionType: selectedOption,
      };
      dispatch(addItemToCart(itemWithCategory));
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handlePlayVideo = (videoUrl) => {
    setVideoUrl(videoUrl);
    setIsModalOpen(true);
  };

  const settings = {
    // dots: true,
    infinite: service?.group_single_service_image?.length > 1,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    cssEase: "ease-in-out",
    // appendDots: (dots) => (
    //   <div className="w-100 position-relative" style={{ bottom: "-20px" }}>
    //     <ul className="m-0 p-2">{dots}</ul>
    //   </div>
    // ),
    // dotsClass: "slick-dots custom-dots",
  };

  // Placeholder image URL
  const placeholderImage =
    "https://placehold.jp/000000/ffffff/150x150.png?text=Cocoma%20Digitals";

  useEffect(() => {
    const el = descRef.current;
    if (el) {
      const isTextTruncated = el.scrollHeight > el.clientHeight;
      setIsTruncated(isTextTruncated);
    }
  }, [service?.featureed_description]);

  return (
    <div className="sevice-details-banner-main-wraper">
      <div className="sevice-details-banner-main">
        <div className="sevice-details-banner-title-subtitle-wraper">
          <h1>{service?.group_service_item_title}</h1>
          <p className="text-muted">
            <Link to="/" style={{ color: "#f5c518" }}>
              Home
            </Link>{" "} /  {" "}
            <Link to={`/services/${service?.slug}`} style={{ color: "#f5c518" }}>Services</Link> / {service?.title}
          </p>
        </div>
        <div className="sevice-details-banner-card-content-wraper">
          {/* left side contents */}
          <div className="sevice-details-banner-card-wraper">
            {service?.group_single_service_image &&
              service?.group_single_service_image?.length > 0 ? (
              <Slider {...settings}>
                {service?.group_single_service_image?.map((images, index) => {
                  return (
                    <div key={images?.id || index}>
                      <div className="position-relative">
                        <img
                          src={images?.image || placeholderImage}
                          alt={`Slide ${index + 1}`}
                          className="sevice-details-banner-slider-image"
                        />
                        <button
                          onClick={() =>
                            handlePlayVideo(
                              images?.upload_video ||
                              images?.video_url
                            )
                          }
                        >
                          <PlayBtn />
                        </button>
                        <div
                          className="position-absolute top-0 end-0 me-3 mt-3"
                          style={{ backgroundColor: "white" }}
                        >
                          <EditLink
                            path={`${ADMIN_URL}/home/group/service/group_single_service_image/show/${images?.id}/${images?.group_service_item_id}/${service?.category_id}`}
                            className="me-1"
                          />
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        <p className="mb-0 sevice-details-banner-content-main-description px-2">
                          {sliderId === images?.id ? (
                            <>
                              {images?.description}
                              <span
                                className="slider-left-read-more-btn"
                                onClick={() => setSliderId(null)}
                              >
                                show less &lt;
                              </span>
                            </>
                          ) : (
                            <>
                              {images?.description?.slice(0, 200)}
                              {images?.description?.length > 200 && "..."}
                              {images?.description?.length > 200 && (
                                <span
                                  className="slider-left-read-more-btn"
                                  onClick={() => setSliderId(images?.id)}
                                >
                                  show more &gt;
                                </span>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </Slider>

            ) : (
              <div>
                <img
                  src={placeholderImage}
                  alt="Placeholder"
                  className="sevice-details-banner-slider-image"
                />
              </div>
            )}
          </div>
          {/* right side contents */}
          <div className="sevice-details-banner-content-wraper">
            <div className="sevice-details-banner-content-title-subtitle-wraper">
              <h3 className="sevice-details-banner-content-main-title">
                {service?.title}
                <EditLink
                  path={`${ADMIN_URL}/home/group/service/group_service_item/show/${service?.id}/${service?.category_id}`}/>
              </h3>
              <div
                ref={descRef}
                className={`sevice-details-banner-content-main-description ${!viewAllLines && "truncate-dec"
                  }`}
                dangerouslySetInnerHTML={{
                  __html: service?.featured_description,
                }}
              />
              {isTruncated && (
                <div
                  className={`slider-right-readMore-btn ${!viewAllLines ? "margin-top-6px" : "margin-top-20px "
                    }`}
                >
                  <button onClick={() => setViewAllLines(!viewAllLines)}>
                    {!viewAllLines ? "show more >" : "show less <"}
                  </button>
                </div>
              )}
            </div>
            <h3 className="sevice-details-banner-content-running-time">
              Running Time
            </h3>
            <div className="sevice-details-banner-content-one-time-reccuring-btn-wraper">
              <button
                className={`btn w-50 p-2 sevice-details-banner-content-one-time-reccuring-btn ${selectedOption === "Recurring"
                  ? "btn-warning"
                  : "btn-outline-secondary"
                  }`}
                onClick={() => handleOptionSelect("Recurring")}
              >
                Recurring
              </button>
              <button
                className={`btn w-50 p-2 sevice-details-banner-content-one-time-reccuring-btn ${selectedOption === "One Time Only"
                  ? "btn-warning"
                  : "btn-outline-secondary"
                  }`}
                onClick={() => handleOptionSelect("One Time Only")}
              >
                One Time Only
              </button>
            </div>

            <button
              className={`btn w-100 px-4 py-2 sevice-details-banner-content-add-btn ${isItemInCart(service?.id) ? "btn-warning" : "btn-dark"
                }`}
              onClick={() => handleToggleCart(service)}
            >
              {isItemInCart(service?.id) ? "Added" : "Add Now"}
            </button>
          </div>
        </div>

        {/* play video modal */}
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
          <Modal.Body style={{ background: "white" }}>
            <div
              className="video-container"
              style={{ position: "relative", paddingTop: "56.25%" }}
            >
              <ReactPlayer
                url={videoUrl}
                controls
                playing={true}
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default SingleServiceSlider;
