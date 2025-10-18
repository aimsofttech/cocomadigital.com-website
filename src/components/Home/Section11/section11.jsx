import { useEffect, useRef, useState } from "react";
import "./Section11.css";
import { RxCountdownTimer } from "react-icons/rx";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { useMediaQuery } from "react-responsive";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const Section11 = ({ MonthlyPerformanceData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(
    MonthlyPerformanceData?.length > 0
      ? MonthlyPerformanceData[0]?.mps_category_name
      : ""
  );
  const [allFilterDataByCategory, setAllFilterDataByCategory] = useState([]);
  const [allSubCategoryData, setAllSubCategoryData] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [
    allFilterByCategorySubCategoryData,
    setAllFilterByCategorySubCategoryData,
  ] = useState([]);
  // const [isAnimating, setIsAnimating] = useState(false);
  const scrollContainerRef = useRef(null);
  const listRef = useRef(null);
  const cardsContainerScrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const isMobile = useMediaQuery({
    query: "(max-width: 576px)",
  });

  // Filter items by the selected category
  // const filteredCategory = MonthlyPerformanceData?.length
  //   ? MonthlyPerformanceData?.find(
  //       (category) => category?.mps_category_name === selectedCategory
  //     )
  //   : null;
  // const filteredData = filteredCategory?.mps_items || [];

  const handleNext = () => {
    // triggerAnimation();
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex + 1) % allFilterByCategorySubCategoryData?.length
    );
  };

  const handlePrev = () => {
    // triggerAnimation();
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + allFilterByCategorySubCategoryData?.length) %
        allFilterByCategorySubCategoryData?.length
    );
  };

  // const triggerAnimation = () => {
  //   setIsAnimating(true);
  //   setTimeout(() => setIsAnimating(false), 500);
  // };

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

  // scroll all cards to top on category change or date change
  const allCardsScrollToTop = () => {
    if (cardsContainerScrollRef?.current) {
      cardsContainerScrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // set the active sub category on select
  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory(subCategory);
    allCardsScrollToTop();
  };

  // filter Data by category filter====>>>>>>>>>>
  useEffect(() => {
    if (MonthlyPerformanceData?.length > 0) {
      const filterDataByCategory = MonthlyPerformanceData?.find(
        (item) => item?.mps_category_name === selectedCategory
      );
      if (filterDataByCategory) {
        setAllFilterDataByCategory(filterDataByCategory);
      }
    }
  }, [MonthlyPerformanceData, selectedCategory]);

  //  collect all subcategory list in an array for filter by date
  useEffect(() => {
    if (allFilterDataByCategory) {
      const getSubCategory = allFilterDataByCategory?.mps_subcategory?.map(
        (subCategory) => subCategory?.mps_subcategory_name
      );
      if (getSubCategory?.length > 0) {
        setAllSubCategoryData(getSubCategory);
      }
    }
  }, [allFilterDataByCategory]);

  // select current sub category data for search by date
  useEffect(() => {
    if (!selectedSubCategory && allSubCategoryData?.length > 0) {
      setSelectedSubCategory(allSubCategoryData[0]);
    }
  }, [selectedSubCategory, allSubCategoryData]);

  // set all cards data by category and sub category====>>>>>>>>>>
  useEffect(() => {
    if (selectedSubCategory && allFilterDataByCategory) {
      const filterByCategorySubCategoryData =
        allFilterDataByCategory?.mps_subcategory?.find(
          (subCategory) =>
            subCategory?.mps_subcategory_name === selectedSubCategory
        );
      if (filterByCategorySubCategoryData?.mps_items?.length > 0) {
        setAllFilterByCategorySubCategoryData(
          filterByCategorySubCategoryData?.mps_items
        );
      }
    }
  }, [allFilterDataByCategory, selectedSubCategory]);

  return (
    <div className="home-monthly-performave-main-wraper">
      <div className="home-monthly-performave-main">
        <div className="home-monthly-performave-title-filter-wraper">
          <h3 className="home-monthly-performave-title">
            Monthly Performance Showcase
            <EditLink
              path={`${ADMIN_URL}/home/performance/monthly_performance_showcase_category`} />
          </h3>
          <div className="home-monthly-performave-filter-wraper">
            <RxCountdownTimer size={30} />
            <select
              className="form-select"
              style={{ border: "none" }}
              value={selectedSubCategory}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
            >
              {allSubCategoryData?.length > 0 &&
                allSubCategoryData?.map((subCategory, index) => (
                  <option key={index} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* header For desktop & mobile */}
        {!isMobile && (
          <div className={`home-slide-nav-wraper`}>
            <div className="home-slide-nav">
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
              <div
                ref={scrollContainerRef}
                className={`home-latest-work-header-scroll-container ${!showLeftButton && !showRightButton
                  ? "justify-content-center"
                  : " "
                  }`}
              >
                <div className="home-latest-work-header-items-wraper">
                  {MonthlyPerformanceData?.map((category) => (
                    <div
                      key={category?.id}
                      className={`home-silde-nav-icon-title-wraper ${selectedCategory === category?.mps_category_name
                        ? "active"
                        : ""
                        }`}
                      onClick={() => {
                        allCardsScrollToTop();
                        setSelectedCategory(category?.mps_category_name);
                      }}
                    >
                      <img
                        src={category?.mps_icon}
                        className="home-silde-nav-icon"
                        alt="items-logo"
                      />
                      <p className="home-slide-nav-items">
                        {category?.mps_category_name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
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

        {!isMobile && (
          <div
            className="border rounded p-4 w-100 position-relative"
            style={{ background: "#F1F1F1" }}
          >
            {allFilterByCategorySubCategoryData?.length > 0 ? (
              <div>
                <div className={`row`}>
                  <div className="col-lg-8 col-md-7">
                    <h2 className="fw-bold ">
                      {
                        allFilterByCategorySubCategoryData[currentIndex]
                          ?.mps_title
                      }
                    </h2>
                    <p className="pt-3">
                      {
                        allFilterByCategorySubCategoryData[currentIndex]
                          ?.mps_description
                      }
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-5">
                    <img
                      src={
                        allFilterByCategorySubCategoryData[currentIndex]
                          ?.mps_img
                      }
                      alt={
                        allFilterByCategorySubCategoryData[currentIndex]
                          ?.mps_title
                      }
                      className="img-fluid rounded summary-images"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    className=" monthly-performance-left-btn me-3"
                    onClick={handlePrev}
                    aria-label="Previous"
                  >
                    <IoMdArrowBack size={22} />
                  </button>
                  <button
                    className=" monthly-performance-right-btn"
                    onClick={handleNext}
                    aria-label="Next"
                  >
                    <IoMdArrowForward size={22} />
                  </button>
                </div>
                <div className="position-absolute top-0 end-0 mt-2 me-3">
                  <EditLink
                    path={`${ADMIN_URL}/home/performance/monthly_performance_showcase_item/show/${allFilterByCategorySubCategoryData[currentIndex]?.id}`} />
                </div>
              </div>
            ) : (
              <p className="text-center">
                No items available in this category.
              </p>
            )}
          </div>
        )}

        {isMobile && (
          <div className="home-slide-nav-allcard-main-wraper">
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
                className={`scroll-box ${!canScrollUp && !canScrollUp ? "responsive-header-item" : " "
                  }`}
                ref={listRef}
                onScroll={checkScrollPosition}
              >
                {/* <div className="scroll-activebar-list-wraper">
                  <div
                    className={`scroll-activebar ${
                      selectedCategory === "all" ? "active" : ""
                    }`}
                  ></div>
                  <div
                    className={`scroll-list-icon-title-wraper`}
                    onClick={() => setActiveCategory("all")}
                  >
                    <img
                      src="/Images/home/all-content-icon.svg"
                      className="home-silde-nav-icon"
                      alt="items-logo"
                    />
                    <div className={`home-slide-nav-items`}>All</div>
                  </div>
                </div> */}
                {MonthlyPerformanceData?.map((category, index) => (
                  <div key={index} className="scroll-activebar-list-wraper">
                    <div
                      className={`scroll-activebar ${selectedCategory === category?.mps_category_name
                        ? "active"
                        : ""
                        }`}
                    ></div>
                    <div
                      key={category?.id}
                      className={`scroll-list-icon-title-wraper`}
                      onClick={() => {
                        setSelectedCategory(category?.mps_category_name);
                        allCardsScrollToTop();
                      }}
                    >
                      <img
                        src={category?.mps_icon}
                        className="home-silde-nav-icon"
                        alt="items-logo"
                      />
                      <p className="home-slide-nav-items">
                        {category?.mps_category_name}
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

            {/* all Videos cards starts here */}

            {allFilterByCategorySubCategoryData?.length > 0 && (
              <div
                ref={cardsContainerScrollRef}
                className="home-monthly-performance-cards-wraper"
              >
                {allFilterByCategorySubCategoryData.map((item, index) => (
                  <div key={index} className="home-monthly-performance-cards">
                    <img src={item.mps_img} alt={item.mps_title} />
                    <div className="home-monthly-performance-cards-content-wraper">
                      <h1>{item.mps_title}</h1>
                      <p>{item.mps_description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Section11;
