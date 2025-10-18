import "./BlogDetailsContent.css";
import { Link } from "react-router-dom";
import { GrFormPreviousLink } from "react-icons/gr";
import EditLink from "../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../utils";

const BlogDetailsContent = ({ data }) => {
  return (
    <>
      <div className="blog-details-main-wrapper">
        <div className="blog-details-back-btn-wrapper">
          <Link className="blog-details-back-btn" to="/blog">
            <GrFormPreviousLink size={28} /> <span>Back</span>
          </Link>
        </div>
        <h1 className="blog-details-content-title">
          {data?.title}
          <EditLink
            path={`${ADMIN_URL}/blog_items/show/${data?.id}`}
          />
        </h1>
        <img
          className="blog-details-content-img"
          src={data?.image}
          alt="blog-details-image"
        />
        <p className="blog-details-content-description">
          {/* {stripHtmlTags(data?.description)} */}
        </p>
        <div dangerouslySetInnerHTML={{ __html: data?.description }}></div>
        {/* <div className="blog-details-content-profile-wrapper">
        <img
          src="/Images/blog/blog-details-profile-img.svg"
          alt="blog-profile-img"
        />
        <div className="blog-details-content-profile-name-content">
          <h1>Kamlesh Singh</h1>
          <p>increased satisfaction and loyalty</p>
        </div>
      </div>
      <h1 className="blog-details-leave-title">leave a reply</h1>
      <div className="blog-details-textarea-wrapper">
        <form action="">
          <textarea placeholder="Comment" required name="" id=""></textarea>
          <button>
            <img
              className="blog-details-subscribe-icon"
              src="/Images/blog/button-icon.svg"
              alt=""
            />
          </button>
        </form>
      </div> */}
        <div className="blog-details-back-btn-wrapper">
          <Link className="blog-details-back-btn" to="/blog">
            <GrFormPreviousLink size={28} /> <span>Back</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogDetailsContent;
