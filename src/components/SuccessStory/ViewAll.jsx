import { useEffect, useState, useRef } from "react";
import "./ViewAll.css";
import adminServiceInstance from "../../Service/apiService";
import Pagination from "../common/Pagination/Pagination";
import ScrollToTop from "../scrollToTop";
import { IoSearchSharp } from "react-icons/io5";
import EditLink from "../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../utils";


const SuccessStoriesViewAll = () => {
    const topScrollToCards = useRef(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [searchTitle, setSearchTitle] = useState("");
    const [debouncedTitle, setDebouncedTitle] = useState(searchTitle);
    const limit = 30;
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
        const handler = setTimeout(() => {
            setDebouncedTitle(searchTitle);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTitle]);


    useEffect(() => {
        const fetchAllSeriesData = async () => {
            try {
                const response = await adminServiceInstance?.getViewAllSuccessStoryItems({
                    limit,
                    offset,
                    title: debouncedTitle,
                });
                console.log("response", response);
                if (response?.data?.data) {
                    setFilteredItems(response?.data?.data?.success_stories);
                    setTotalItemCount(response?.data?.data?.total_count);
                }
            } catch (error) {
                console.log("Error", error);
            }
        };
        fetchAllSeriesData();
    }, [limit, offset, debouncedTitle]);


    return (
        <div ref={topScrollToCards} className="all-series-data-main-wraper">
            <ScrollToTop />
            {/* Filters */}
            <div className="success-stories-view-all-filter-search-wrapper">
                <div className="success-stories-view-all-filter-input-wrapper">
                    <input
                        value={searchTitle}
                        type="text"
                        placeholder="Search by title..."
                        onChange={(event)=>setSearchTitle(event.target.value)}
                    />
                    <IoSearchSharp className="search-icon"/>
                </div>
            </div>
            <div className="row g-3">
                {filteredItems?.map((item, index) => (
                    <div className="col-6 col-md-4 all-series-data-card border-0 position-relative" key={index}>
                        <img
                            src={item?.client_img}
                            alt={item?.success_stories_description}
                            style={{ maxHeight: "220px" }}
                        />
                        <p className="card-text fw-bold mt-1">{item?.client_title}</p>
                        <div className="position-absolute bottom-0 end-0 mb-2 me-2">
                            <EditLink
                                path={`${ADMIN_URL}/home/client/show/${item?.id}`} />
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

            {filteredItems?.length === 0 && (
                <div className="text-center mt-4">
                    <p>No movies/items found for the selected filters.</p>
                </div>
            )}
        </div>
    );
};

export default SuccessStoriesViewAll;
