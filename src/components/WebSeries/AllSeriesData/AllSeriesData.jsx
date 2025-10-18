import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./AllSeriesData.css";
import AdminService from "../../../Service/apiService";
import Pagination from "../../common/Pagination/Pagination";
import ScrollToTop from "../../scrollToTop";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const AllSeriesData = ({ marketingCategory, marketingYear }) => {
  const topScrollToCards = useRef(null);
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const limit = 32;
  const offset = (activePage - 1) * limit;
  const totalPages = Math.ceil(totalItemCount / limit);

  const scrollToTopToCards = () => {
    if (topScrollToCards.current) {
      const y =
        topScrollToCards.current.getBoundingClientRect().top +
        window.pageYOffset -
        90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchAllSeriesData = async () => {
      try {
        const response = await AdminService?.getAllSeries({
          year,
          category_id: category,
          limit,
          offset,
          title: searchTitle,
        });
        if (response?.data?.data) {
          setFilteredItems(response?.data?.data?.marketingItemData);
          if (category || year || searchTitle) {
            setTotalItemCount(response?.data?.data?.marketingItemData?.length);
          } else {
            setTotalItemCount(response?.data?.data?.total_marketingItem);
          }
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchAllSeriesData();
  }, [year, category, limit, offset, searchTitle]);

  const ItemSearchHandler = (event) => {
    const getData = setTimeout(() => {
      setSearchTitle(event?.target?.value);
    }, 500);
    return () => clearTimeout(getData);
  };

  return (
    <div ref={topScrollToCards} className="all-series-data-main-wraper">
      <ScrollToTop />
      {/* Filters */}
      <div className="all-series-data-filter-search-wraper">
        {/* Category Filter */}
        <div className="all-series-data-filter-wraper">
          <div className="all-series-data-filter">
            <label
              htmlFor="categoryFilter"
              className="all-series-data-filter-title"
            >
              Category
            </label>
            <select
              id="categoryFilter"
              className="form-select"
              onChange={(e) => setCategory(e?.target?.value)}
              value={category}
            >
              <option value="">All</option>
              {marketingCategory?.map((category, index) => (
                <option key={index} value={category?.id}>
                  {category?.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="all-series-data-filter">
            <label
              htmlFor="yearFilter"
              className="all-series-data-filter-title"
            >
              Year
            </label>
            <select
              id="yearFilter"
              className="form-select"
              onChange={(e) => setYear(e?.target?.value)}
              value={year}
            >
              <option value="">All</option>
              {marketingYear?.map((year, index) => (
                <option key={index} value={year?.year}>
                  {year?.year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="all-series-data-search-input-wraper">
          <input
            // value={searchTitle}
            type="text"
            placeholder="Search by title..."
            onChange={ItemSearchHandler}
          />
        </div>
      </div>

      {/* Movie Grid */}
      <div className="row g-3">
        {filteredItems?.map((item, index) => (
          <div className="col-6 col-md-4 col-lg-3 all-series-data-card border-0 position-relative">
            <Link
              key={index}
              className=""
              to={`/web-series-individual/${item?.slug}`}
            >
              <img
                src={item?.poster_image || "../../Images/movieimg.svg"}
                alt={item?.title || "Untitled"}
                className="card-img-top-card"
              />
            </Link>
            <div className="position-absolute bottom-0 end-0 mb-2 me-3">
              <EditLink
                path={`${ADMIN_URL}/home/marketing/marketing_house_item/show/${item?.id}`} />
            </div>
          </div>
        ))}
      </div>

      {totalItemCount > 8 && (
        <Pagination
          totalPages={totalPages}
          currentPage={activePage}
          onPageChange={setActivePage}
          scrollToTopToCards={scrollToTopToCards}
        />
      )}

      {filteredItems.length === 0 && (
        <div className="text-center mt-4">
          <p>No movies/items found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default AllSeriesData;
