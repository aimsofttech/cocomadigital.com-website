import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "./CreativeHouse.css";
import Slider from "react-slick";
import { useMediaQuery } from "react-responsive";
import AdminService from "../../Service/apiService";
import Pagination from "../common/Pagination/Pagination";
import PlayBtn from "../common/PlayBtn/PlayBtn";
import EditLink from "../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../utils";

const CreativeHouseProject = ({ creativeCategory }) => {
  const topScrollToCards = useRef(null);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredItemCount, setFilteredItemCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const { slug } = useParams();
  const limit = 20;
  const offset = (currentPage - 1) * limit;
  const totalPages = Math.ceil(filteredItemCount / limit);


  useEffect(() => {
    const getCreativeHouseItems = async () => {
      setLoading(true);
      try {
        const params = {
          slug,
          title: searchTitle,
          limit,
          offset,
        }
        const response = await AdminService.CreativeHouseItems(params);
        if (response?.data?.data) {
          setFilteredItems(response?.data?.data?.creativeItemData);
          if (slug || searchTitle) {
            setFilteredItemCount(
              response?.data?.data?.creativeItemData?.length
            );
          } else {
            setFilteredItemCount(response?.data?.data?.total_creativeItem);
          }
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    getCreativeHouseItems();
  }, [slug, limit, offset, searchTitle]);

  const scrollToTopToCards = () => {
    if (topScrollToCards.current) {
      const y =
        topScrollToCards.current.getBoundingClientRect().top +
        window.pageYOffset -
        150;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const searchTextChangeHandler = (event) => {
    const getData = setTimeout(() => {
      setSearchTitle(event?.target?.value);
    }, 500);
    return () => clearTimeout(getData);
  };

  return (
    <div className="creative-house-creative-project-main-wraper mt-4">
      <div className="creative-house-creative-project-main">
        <FilterBar
          categories={creativeCategory}
          currentCategory={slug}
          searchTextChangeHandler={searchTextChangeHandler}
        />
        {loading && (
          <div
            style={{ height: "100px" }}
            className="d-flex justify-content-center align-items-center"
          >
            <samp>Loading...</samp>
          </div>
        )}
        {!loading && filteredItems?.length > 0 && (
          <div ref={topScrollToCards} className="w-100">
            <VideoGrid
              videos={filteredItems}
            // setHoveredItem={setHoveredItem}
            // hoveredItem={hoveredItem}
            />
          </div>
        )}
        {!loading && totalPages > 1 && (
          <div className="w-100 mt-4">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              scrollToTopToCards={scrollToTopToCards}
            />
          </div>
        )}
        {!loading && filteredItems?.length === 0 && (
          <div className="text-center mt-4">
            <p>No movies/items found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterBar = ({
  categories,
  currentCategory,
  onCategoryChange,
  searchTextChangeHandler,
}) => {
  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const isMobile = useMediaQuery({
    query: "(max-width: 1000px)",
  });

  return (
    <div className="mb-3">
      <div className="w-100 d-flex justify-content-start align-content-start mb-1">
        <EditLink
          path={`${ADMIN_URL}/home/creative_house/creative_house_category`} />
      </div>
      {!isMobile && (
        <div className="creative-house-filter-search-wraper">
          <div className="SliderCustom-width">
            {categories?.map((category, index) => (
              <Link
                key={index}
                to={`/creative-house/${category?.slug}`}
                className={`creative-house-category-btn btn w-auto my-1 me-2 ${currentCategory === category?.slug
                  ? "btn-dark"
                  : "btn-outline-dark"
                  }`}
              >
                {category?.creative_house_category_name}
              </Link>
            ))}
          </div>
          <div className="creative-house-search-input-wraper">
            <input
              type="text"
              // value={searchTitle}
              onChange={searchTextChangeHandler}
              placeholder="Search by title..."
            />
          </div>
        </div>
      )}
      {isMobile && (
        <>
          <Slider {...sliderSettings} className="SliderCustom-width">
            {categories?.map((category, index) => (
              <Link
                key={index}
                to={`/creative-house/${category?.slug}`}
                className={`creative-house-category-btn btn w-auto my-1 me-2 ${currentCategory === category?.slug
                  ? "btn-dark"
                  : "btn-outline-dark"
                  }`}
              >
                {category?.creative_house_category_name}
              </Link>
            ))}
          </Slider>
          <div className="creative-house-search-input-wraper">
            <input
              type="text"
              // value={searchTitle}
              onChange={searchTextChangeHandler}
              placeholder="Search by title..."
            />
          </div>
        </>
      )}
    </div>
  );
};

// All videos cards
const VideoGrid = ({ videos }) => {
  return (
    <div className="row">
      {videos?.map((item, index) => {
        return (
          <div
            key={index}
            className="col-6 col-sm-4 col-lg-3 px-1 mt-2 card-CreativeHouse-main-container"
          >
            <div className="card-CreativeHouse">
              {/* Main Thumbnail */}
              <Link to={`/single-video/${item?.slug}`}>
                <img
                  src={
                    item?.creative_house_thumbnail?.startsWith("http")
                      ? item?.creative_house_thumbnail
                      : `https://cocomadigitalmediabucket.s3.eu-north-1.amazonaws.com/creative-house-thumbnail/${item?.creative_house_thumbnail}`
                  }
                  className="card-img-top"
                  alt="Video Thumbnail"
                />
                {(item?.creative_house_upload_video_url ||
                  item?.creative_house_video_url) && <PlayBtn />}
              </Link>
              <div className="position-absolute top-0 end-0 me-1">
                <EditLink
                  path={`${ADMIN_URL}/home/creative_house/creative_house_item/show/${item?.id}`} />
              </div>
              {/* Hover Content */}
              {/* <div className="card-CreativeHouse-show-afterImage-Hover">
              <div>
                <h6>{item.creative_house_video_title}</h6>
                <p>{item.requirement_description}</p>
              </div>
            </div> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CreativeHouseProject;
