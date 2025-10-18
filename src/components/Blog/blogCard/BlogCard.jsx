import "./BlogCard.css";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const BlogCard = ({ data }) => {

  return (
    <div className="row w-100">
      {data?.map((item, index) => {
        return (
          <div className="col-lg-3 col-md-4 col-6 blog-card-main-wrapper position-relative">
            <Link
              key={index}
              to={`/blog-details/${item?.slug}`}
              className=""
            >
              <div className="blog-card-main">
                <img
                  className="blog-card-img"
                  src={item?.image}
                  alt="blog-card"
                />
                <div className="blog-card-content-wrapper">
                  <p className="blog-card-date">
                    {moment(item?.date)?.format("MMM Do YYYY")}
                  </p>
                  <h1 className="blog-card-title">{item?.title}</h1>
                  {/* <p className="blog-card-desc">
                  {stripHtmlTags(item.description)}{" "}
                </p> */}
                </div>
              </div>
            </Link>
            <div className="position-absolute bottom-0 end-0 me-3 mb-2">
              <EditLink
                path={`${ADMIN_URL}/blog_items/show/${item?.id}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogCard;
