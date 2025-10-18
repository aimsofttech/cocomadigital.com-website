import "./CreativeHouseServices.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CreativeHouseServices = ({ serviceData, allCategories }) => {

  const CustomPrevArrow = ({ className, style, onClick }) => (
    <div
      className={`${className} service-scroll-button left`}
      onClick={onClick}
    >
      <FaChevronLeft size={20} color="#000" />
    </div>
  );

  const CustomNextArrow = ({ className, style, onClick }) => (
    <div
      className={`${className} service-scroll-button right`}
      onClick={onClick}
    >
      <FaChevronRight size={20} color="#000" />
    </div>
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
    ],
  };

  return (
    <div className="single-video-page-services-main-warper">
      <div className="single-video-page-services-main">
        {/* Services Section */}
        {serviceData?.length > 0 && <div className="single-video-page-services-section">
          <div className="text-center">
            <h2 className="single-video-how-to-edit-title">
              Creative House Services
            </h2>
          </div>
          <div className="row">
            {serviceData?.map((service) => (
              <Link
                to={`/service/${service?.id}`}
                key={service?.id}
                className="col-6 col-lg-4 mt-5 px-2 single-video-page-services-section-card"
              >
                <div className="card border-0 shadow-sm h-100">
                  <img
                    src={service?.service_image}
                    alt={service?.service_title}
                    className="card-img-top"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="single-video-page-services-section-card-title">
                      {service?.service_title}
                    </h5>
                    <p
                      to={service?.link}
                      className="btn btn-dark single-video-page-services-section-card-btn"
                    >
                      Explore Now{" "}
                      <span>
                        <GoArrowUpRight size={20} />
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>}
        {/* Categories Section */}
        {allCategories?.length > 0 && <div className="single-video-page-category-section-main">
          <h3 className="single-video-how-to-edit-title">
            Explore More
            {/* &nbsp;
            <span className="fw-bold text-decoration-underline">
              &lt; Creative Categories &gt;
            </span> */}
          </h3>
          <div className="w-100 explore-more-cards-wrapper">
            <Slider {...settings}>
              {allCategories?.map((category, index) => {
                return (
                  // category?.creative_house_category_name !== "Videos" && (
                  <div key={index} className="px-1 explore-more-cards position-relative">
                    <Link
                      to={`/creative-house/${category?.slug}`}
                      className="w-100 d-block text-center text-dark text-decoration-none py-4 px-2 border rounded shadow-sm"
                    >
                      <div className="mb-2 d-flex align-items-center justify-content-center">
                        <img
                          src="../../Images/creativehouseVideoicon.svg"
                          alt={category?.category_name}
                        />
                      </div>
                      <h5 className="single-video-page-category-section-card-title">
                        {category?.category_name}
                      </h5>
                    </Link>
                    <div className="position-absolute top-0 end-0 me-2">
                      </div>
                  </div>
                  // )
                );
              })}
            </Slider>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default CreativeHouseServices;
