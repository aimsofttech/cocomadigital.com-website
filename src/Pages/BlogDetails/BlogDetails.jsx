import { useEffect, useState } from "react";
import "./BlogDetails.css";
// import Instagram from "../../components/Blog/Instagram/Instagram";
import BlogDetailsContent from "../../components/BlogDetails/BlogDetailsContent";
// import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import adminServiceInstance from "../../Service/apiService";
import Loader from "../../components/common/Loader/Loader";

const BlogDetails = () => {
  const { slug } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const isMobile = useMediaQuery({
  //   query: "(max-width: 450px)",
  // });

  useEffect(() => {
    const getBlogDetailsApi = async () => {
      try {
        if (slug) {
          const response = await adminServiceInstance?.getBlogDetails(slug);
          setData(response?.data?.data?.blogItem);
        }
      } catch (error) {
        console.log("error", error);
        setError(error?.message);
      } finally {
        setLoading(false);
      }
    };
    getBlogDetailsApi();
  }, [slug]);

  if (loading)
    return (
        <Loader/>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="blog-details-main">
      <div className="blog-details">
        {/* {!isMobile && (
          <div className="blog-details-left-content">
            <h1 className="blog-details-subscribe-title">Subscribe</h1>
            <div className="blog-details-subscribe-input-wrapper">
              <form action="">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  required
                />
                <button>
                  <img
                    className="blog-details-subscribe-icon"
                    src="/Images/blog/button-icon.svg"
                    alt="icon"
                  />
                </button>
              </form>
            </div>
            <Instagram title="Post related portfolio" />
            <button className="blog-details-contact-btn">Contact Us</button>
          </div>
        )} */}
        <div className="blog-details-right-content">
          <BlogDetailsContent data={data} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
