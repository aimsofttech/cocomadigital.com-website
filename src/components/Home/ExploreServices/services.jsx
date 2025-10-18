import { useState, useEffect, useRef } from "react";
import "./Service.css";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { GoArrowUpRight } from "react-icons/go";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";
import adminServiceInstance from "../../../Service/apiService";
import { useSelector } from "react-redux";

export default function ExploreOurServices() {
  const scrollContainerRef = useRef(null);
  const listRef = useRef(null);
  const allCardsScrollRef = useRef(null);
  const serviceData = useSelector((state) => state?.service?.services?.data);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [services, setServices] = useState(serviceData);
  const { service_category = [] } = useSelector((state) => state?.commonApi?.commonApi?.data || {});
  const isMobile = useMediaQuery({
    query: "(max-width: 576px)",
  });
  const scrollAmount = 180;
  const filterCategory = service_category?.filter((item) => item?.category_name !== "Service Platform");

  useEffect(() => {
    if (filterCategory?.length > 0) {
      setActiveCategoryId(filterCategory[0]?.id);
    }
  }, [filterCategory]);

  // Fetch Services data on category change
  const fetchServiceData = async (id) => {
    try {
      const params = {
        category_id: id,
        limit: 6,
        offset: 0
      };
      const response = await adminServiceInstance?.Services(params);
      setServices(response?.data?.data);
    } catch (err) {
      console.log(err.message || "Something went wrong");
    }
  };

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
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
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

  const categoryChangeHandler = (id) => {
    fetchServiceData(id)
    setActiveCategoryId(id);
    if (allCardsScrollRef?.current) {
      allCardsScrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="service-main-wraper">
      <div className="service-main">
        {/* MarketingCreative for desktop & mobile */}
        <div className="marketing-creative-main">
          <div className="marketing-creative-title-subtitle-all-wraper">
            <div className="service-marketing-creative-title-subtitle-wraper">
              <h2 className="fw-bold service-marketing-creative-subtitle ">
                Our YouTube Services
                <EditLink
                  path={`${ADMIN_URL}/home/service/service_category`} />
              </h2>
            </div>
          </div>
          <div className="home-slide-nav-allcard-main-wraper">
            {/* header For desktop & mobile */}
            {!isMobile && (
              <div className={`home-slide-nav-wraper`}>
                <div className="home-slide-nav">
                  {/* Left scroll button */}
                  {showLeftButton && (
                    <button
                      onClick={scrollLeft}
                      className={`home-latest-work-header-scroll-button left`}
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
                  )}
                  {/* Scrollable container */}
                  <div
                    ref={scrollContainerRef}
                    className={`home-latest-work-header-scroll-container ${!showLeftButton && !showRightButton
                      ? "justify-content-center"
                      : " "
                      }`}
                  >
                    <div className="home-latest-work-header-items-wraper">
                      {/* <div className={`home-silde-nav-icon-title-wraper 
              ${activeCategory === "all" ? "active" : ""}
            `}
              onClick={() => setActiveCategory("all")}
              >
              <img src= "/Images/home/all-content-icon.svg" className="home-silde-nav-icon" alt="items-logo"/>
               <div
                className={`home-slide-nav-items`}
              >
                All
              </div>
              </div> */}
                      {filterCategory?.map((category, index) => (
                        <div
                          key={index}
                          className={`home-silde-nav-icon-title-wraper ${activeCategoryId === category?.id ? "active" : ""
                            }`}
                          onClick={() => {
                            categoryChangeHandler(category?.id);
                          }}
                        >
                          {category?.icon &&
                            <img
                            src={category?.icon}
                            className="home-silde-nav-icon"
                            alt="items-logo"
                            />
                          }
                          <p className="home-slide-nav-items">
                            {category?.category_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Right scroll button */}
                  {showRightButton && (
                    <button
                      onClick={scrollRight}
                      className={`home-latest-work-header-scroll-button right`}
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
                  )}
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
                  className={`scroll-box ${!canScrollUp && !canScrollUp
                    ? "responsive-header-item"
                    : " "
                    }`}
                  ref={listRef}
                  onScroll={checkScrollPosition}
                >
                  {/* <div className="scroll-activebar-list-wraper">
                <div 
                  className={`scroll-activebar ${activeCategory === "all" ? "active" : ""}`} >
                </div>
               <div className={`scroll-list-icon-title-wraper`}
                 onClick={() => setActiveCategory("all")}
               >
              <img src= "/Images/home/all-content-icon.svg" className="home-silde-nav-icon" alt="items-logo"/>
               <div
                className={`home-service-slide-nav-items`}
              >
                All
              </div>
              </div>
              </div> */}
                  {filterCategory?.map((category, index) => (
                    <div
                      key={index}
                      className="scroll-service-activebar-list-wraper"
                    >
                      <div
                        className={`scroll-activebar ${activeCategoryId === category?.id ? "active" : ""
                          }`}
                      ></div>
                      <div
                        key={category?.id}
                        className="scroll-list-icon-title-wraper"
                        onClick={() => {
                          categoryChangeHandler(category?.id);
                        }}
                      >
                        {category?.icon && <img
                          src={category?.icon}
                          className="home-silde-nav-icon"
                          alt="items-logo"
                        />}
                        <p className="home-service-slide-nav-items">
                          {category?.category_name
                            ?.split(" ")
                            .slice(0, 3)
                            .join(" ")}
                          {category?.category_name?.split(" ")?.length >
                            3 && "..."}
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
            {services &&
              <div
                ref={allCardsScrollRef}
                className="home-creative-videos-card-container-main"
              >
                {Array.isArray(services) && services?.length > 0 ? (
                  services?.map((service, index) => (
                    <div key={index} className="home-service-card text-center">
                      <Link
                        to={`/services/${service?.slug}`}
                        style={{ width: "100%" }}
                      >
                        <img
                          src={service?.image}
                          alt={service?.title}
                          className="img-fluid w-100"
                        />
                        <div className="home-service-card-title-btn-wraper">
                          <h3 className="mt-2" style={{ color: "black" }}>
                            {service?.title}
                          </h3>
                          <button className="home-explore-button">
                            <Link to={`/service/${service?.id}`}>
                              {service?.button_text}{" "}
                              <GoArrowUpRight size={24} />
                            </Link>
                          </button>
                        </div>
                      </Link>
                      <div className="position-absolute bottom-0 end-0 mb-2 me-2">
                        <EditLink
                          path={`${ADMIN_URL}/home/service/service_item/show/${service?.id}`} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ width: "100%", textAlign: "center", font: "bold" }}>
                    Data Not Available
                  </p>
                )}
              </div>}
          </div>
        </div>
        {/* {activeCategory?.length > 6 && (
          <button
            className="home-service-show-more-btn"
            onClick={ShowHideMoreData}
          >
            {!activeViewAllData ? "Show More" : "Show Less"}
            <img src="/Images/home/dropdown-arrow.svg" alt="down arrow icon" />
          </button>
        )} */}
      </div>
    </div>
  );
}
