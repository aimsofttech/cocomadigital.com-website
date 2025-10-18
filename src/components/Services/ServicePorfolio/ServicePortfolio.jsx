import { useState, useEffect, useRef } from "react";
import "./ServicePortfolio.css";
import ReactPlayer from "react-player";
import { useMediaQuery } from "react-responsive";
import PlayBtn from "../../common/PlayBtn/PlayBtn";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";
import adminServiceInstance from "../../../Service/apiService";

const Portfolio = ({ portfolioCategories }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(-1);
  const scrollContainerRef = useRef(null);
  const listRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
  const isMobile = useMediaQuery({
    query: "(max-width: 576px)",
  });

  // Fetch portfolio data
useEffect(() => {
  const fetchServicePortfolio = async () => {
    try {
      if (!portfolioCategories[0]?.group_service_item_id) return;

      const params = {
        group_service_item_id: portfolioCategories[0].group_service_item_id,
        portfolio_category_id: activeCategoryId,
      };
      const response = await adminServiceInstance.ServicePortfolio(params);
      setPortfolioData(response?.data?.data)
      console.log("fetchServicePortfolio", response?.data?.data);
    } catch (err) {
      console.error("Error fetching service portfolio:", err);
    }
  };

  fetchServicePortfolio();
}, [portfolioCategories, activeCategoryId]);


  // const videosPerPage = 6;

  const scrollAmount = 180;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Update scroll button visibility
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };
  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, []);

  useEffect(() => {
    checkScrollPosition();
  }, []);

  const checkScrollPosition = () => {
    if (listRef.current) {
      setCanScrollUp(listRef.current.scrollTop > 0);
      setCanScrollDown(
        listRef.current.scrollTop + listRef.current.clientHeight <
        listRef.current.scrollHeight
      );
    }
  };

  const scrollUp = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: -100, behavior: "smooth" });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const scrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: 100, behavior: "smooth" });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handlePlay = (id) => {
    setPlayingVideoId(id);
  };

  return (
    <div className="service-details-porfolio-main-wraper">
      <div className="service-details-porfolio-main">
        <div className="marketing-creative-main">
          <div className="marketing-creative-title-subtitle-all-wraper">
            <div className="marketing-creative-title-subtitle-wraper">
              <h2 className="fw-bold text-uppercase service-page-video-edit-service-title">
                Portfolio
                <EditLink
                  path={`${ADMIN_URL}/home/group/service/portfolio/group_single_service_portfolio_category`}
                />
              </h2>
            </div>
            {/* {!isMobile && (
              <Link to="/creative-house">
                <button className="view-all-button-new">
                  View All <GoArrowUpRight size={20} />
                </button>
              </Link>
            )} */}
          </div>
          <div className="home-slide-nav-allcard-main-wraper">
            {/* header For desktop & mobile */}
            {!isMobile && (
              <div className={`home-slide-nav-wraper`}>
                <div className="home-slide-nav">
                  {/* Left scroll button */}
                  <button
                    onClick={scrollLeft}
                    className={`home-latest-work-header-scroll-button left ${showLeftButton ? "visible" : "hidden"
                      }`}
                    aria-label="Scroll left"
                  >
                    <div className="home-latest-work-header-button-content mr-5">
                      <img
                        src="/Images/home/secondary-arrow-icon.svg"
                        className="left-scroll-icon"
                        alt="items-logo"
                      />
                    </div>
                  </button>
                  {/* Scrollable container */}
                  <div
                    ref={scrollContainerRef}
                    className="service-porfolio-header-scroll-container"
                  >
                    <div className="home-latest-work-header-items-wraper">
                      <div
                        className={`home-silde-nav-icon-title-wraper 
                              ${activeCategoryId === -1 ? "active" : ""}
                                `}
                        onClick={() => setActiveCategoryId(-1)}
                      >
                        {/* <img
                          src="/Images/home/all-content-icon.svg"
                          className="home-silde-nav-icon"
                          alt="items-logo"
                        /> */}
                        <div className={`home-slide-nav-items`}>All</div>
                      </div>
                      {portfolioCategories?.map((category) => (
                        <div
                          key={category?.id}
                          className={`home-silde-nav-icon-title-wraper ${activeCategoryId === category?.id
                            ? "active"
                            : ""
                            }`}
                          onClick={() =>
                            setActiveCategoryId(category?.id)
                          }
                        >
                          {/* <img
                            src={category?.creative_house_icon}
                            className="home-silde-nav-icon"
                            alt="items-logo"
                          /> */}
                          <p className="home-slide-nav-items">
                            {category?.category_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Right scroll button */}
                  <button
                    onClick={scrollRight}
                    className={`home-latest-work-header-scroll-button right ${showRightButton ? "visible" : "hidden"
                      }`}
                    aria-label="Scroll right"
                  >
                    <div className="home-latest-work-header-button-content ml-5">
                      <img
                        src="/Images/home/secondary-arrow-icon.svg"
                        className="right-scroll-icon"
                        alt="items-logo"
                      />
                    </div>
                  </button>
                </div>
              </div>
            )}
            {isMobile && (
              <div className="scroll-container">
                {canScrollUp && (
                  <div className="res-scroll-btn top-btn">
                    <button onClick={scrollUp}>
                      <img
                        src="/Images/home/secondary-arrow-icon.svg"
                        className="top-scroll-icon"
                        alt="items-logo"
                      />
                    </button>
                  </div>
                )}
                <div
                  className="service-details-porfolio-header-scroll-box"
                  ref={listRef}
                  onScroll={checkScrollPosition}
                >
                  <div className="scroll-activebar-list-wraper">
                    <div
                      className={`scroll-activebar ${setActiveCategoryId === -1 ? "active" : ""
                        }`}
                    ></div>
                    <div
                      className={`scroll-list-icon-title-wraper`}
                      onClick={() => setActiveCategoryId(-1)}
                    >
                      {/* <img
                        src="/Images/home/all-content-icon.svg"
                        className="home-silde-nav-icon"
                        alt="items-logo"
                      /> */}
                      <div className={`home-slide-nav-items`}>All</div>
                    </div>
                  </div>
                  {portfolioCategories?.map((category, index) => (
                    <div className="scroll-activebar-list-wraper" key={index}>
                      <div
                        className={`scroll-activebar ${activeCategoryId === category?.id
                          ? "active"
                          : ""
                          }`}
                      ></div>
                      <div
                        className={`scroll-list-icon-title-wraper`}
                        onClick={() =>
                          setActiveCategoryId(category?.id)
                        }
                      >
                        {/* <img
                          src={category?.creative_house_icon}
                          className="home-silde-nav-icon"
                          alt="items-logo"
                        /> */}
                        <p className="service-details-porfolio-slide-nav-items">
                          {category?.category_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {canScrollDown && (
                  <div className="res-scroll-btn bottom-btn">
                    <button onClick={scrollDown}>
                      <img
                        src="/Images/home/secondary-arrow-icon.svg"
                        className="left-scroll-icon"
                        alt="items-logo"
                      />
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* all Videos cards starts here */}
            {portfolioData?.length > 0 ? (
              <div className="home-creative-videos-card-container-main">
                {portfolioData?.map((video) => (
                  <div
                    key={video?.id}
                    className="service-details-porfolio-video-cards"
                  >
                    <div className="position-relative videoplayer-and-thumbnail">
                      {playingVideoId === video?.id ? (
                        <div
                          className="video-container"
                          style={{ position: "relative", paddingTop: "70%" }}
                        >
                          <ReactPlayer
                            url={video?.video_url}
                            controls
                            playing={true}
                            width="100%"
                            height="100%"
                            style={{ position: "absolute", top: 0, left: 0 }}
                          />
                        </div>
                      ) : (
                        <div
                          className="thumbnail-container"
                          onClick={() => handlePlay(video?.id)}
                          style={{ cursor: "pointer", position: "relative" }}
                        >
                          <img
                            src={
                              video?.thumbnail ||
                              "https://via.placeholder.com/150"
                            }
                            alt="Video Thumbnail"
                            className="img-fluid video-thumbnail"
                            style={{ width: "100%", height: "auto" }}
                          />
                          <PlayBtn />
                        </div>
                      )}
                      <div className="position-absolute top-0 end-0 me-2 mt-1">
                        <EditLink
                          path={`${ADMIN_URL}/home/roup/service/portfolio/group_single_service_portfolio_item/show/${video?.id}/${video?.category_id}`}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-100 d-flex justify-content-center align-content-center">
                <p>{`Data Not Available`}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
