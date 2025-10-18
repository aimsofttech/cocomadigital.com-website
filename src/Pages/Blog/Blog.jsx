import { useEffect, useState } from "react";
import "./Blog.css";
import Category from "../../components/Blog/Category/Category";
// import TopPost from "../../components/Blog/TopPost/TopPost";
// import Instagram from "../../components/Blog/Instagram/Instagram";
import BlogCard from "../../components/Blog/blogCard/BlogCard";
import Pagination from "../../components/common/Pagination/Pagination";
// import { useMediaQuery } from "react-responsive";
import adminServiceInstance from "../../Service/apiService";
import Loader from "../../components/common/Loader/Loader";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [allCardList, setAllCardList] = useState([]);
  const [cardListCount, setCardListCount] = useState(0);
  const [mainLoading, setMainLoading] = useState(true);
  const [error, setError] = useState(null);
  // const isMobile = useMediaQuery({
  //   query: "(max-width: 450px)",
  // });
  const limit = 10;
  const totalPages = Math.ceil(cardListCount / limit);
  const offset = (currentPage - 1) * limit;

  // api for fetch all categories list
  useEffect(() => {
    const getAllBlogCategory = async () => {
      try {
        const response = await adminServiceInstance?.getBlogCategory();
        setCategories(response?.data?.data?.blog);
      } catch (error) {
        console.log("Error", error);
        setError(error.message);
      }
    };
    getAllBlogCategory();
  }, []);

  // fetch all card list
  useEffect(() => {
    const getAllBlogList = async () => {
      try {
        const response = await adminServiceInstance?.getBlogs({
          search: searchInput,
          subcategory: activeCategory,
          limit,
          offset,
        });
        setAllCardList(response?.data?.data?.blogItems);
        if (searchInput || activeCategory) {
          setCardListCount(response?.data?.data?.blogItems?.length);
        } else {
          setCardListCount(response?.data?.data?.total_blog);
        }
      } catch (error) {
        console.log("error", error);
        setError(error.message);
      } finally {
        setMainLoading(false);
      }
    };
    getAllBlogList();
  }, [activeCategory, searchInput, limit, offset]);


  if (mainLoading)
    return (
      <Loader />
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="blog-outer">
        <div className="blog-main-wrapper">
          {categories?.length > 0 && (
            <Category
              categories={categories}
              setActiveCategory={setActiveCategory}
              activeCategory={activeCategory}
              setSearchInput={setSearchInput}
            />
          )}
          <div className="blog-main">
            {/* {!isMobile && (
              <div className="blog">
                <TopPost />
                <Instagram title="Instagram" />
              </div>
            )} */}
            {allCardList?.length > 0 && <BlogCard data={allCardList} />}
            {allCardList?.length === 0 && (
              <div className="blog-card-not-fount-wrapper">
                <h5>Data Not Available {activeCategory}</h5>
              </div>
            )}
          </div>
          {allCardList?.length > limit && (
            <div className="blog-pagination-wrapper">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
