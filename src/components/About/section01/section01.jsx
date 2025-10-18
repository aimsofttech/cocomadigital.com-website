import "./section01.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMediaQuery } from "react-responsive";
import SecondaryLink from "../../common/SecondaryLink/SecondaryLink";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const Section01 = ({ bannerData }) => {
  const isTablet = useMediaQuery({
    query: "(min-width: 577px) and  (max-width: 800px)",
  });

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="service-page-main-wraper">
      <div className="service-page-main">
        {bannerData?.length > 0 ? (
          <Slider {...settings}>
            {bannerData?.map((banner) => {
              return (
                <div key={banner?.id} className="slider-slide">
                  <div className="service-page-card-cpntent-wraper">
                    {/* Text Second on Mobile (order-2), First on Desktop (order-md-1) */}
                    <div className="service-page-cpntent-wraper">
                      <h1 className="section-page-heading-01">
                        <EditLink
                          path={`${ADMIN_URL}/home/group/service/group_service_top_banner/show/${banner?.id
                            }/${banner?.item_id}`} className="me-2" />
                        {banner?.heading}
                      </h1>
                      <div className="section-page-discription">
                        {banner?.subheading}
                      </div>
                      {!isTablet && (
                        <div className="service-banner-desktop-btn-wraper">
                          <SecondaryLink
                            path="/ScheduleMeeting"
                            title={banner?.button_text}
                          />
                        </div>
                      )}
                    </div>
                    {/* Image First on Mobile (order-1), Second on Desktop (order-md-2) */}
                    <div className="service-page-card-wraper">
                      <img
                        src={banner?.image}
                        alt={banner?.heading}
                        className="img-fluid banner-img"
                      />
                    </div>
                  </div>
                  {isTablet && (
                    <div className="service-banner-desktop-btn-wraper">
                      <SecondaryLink
                        path="/ScheduleMeeting"
                        title={banner?.button_text}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </Slider>
        ) : (
          // Single Banner Case
          <div className="slider-slide">
            <div className="service-page-card-cpntent-wraper">
              {/* Text Second on Mobile (order-2), First on Desktop (order-md-1) */}
              <div className="service-page-cpntent-wraper">
                <h1 className="section-page-heading-01">
                  Elevate Your Visuals with Expert YouTube Video Editing
                </h1>
                <div className="section-page-discription">
                  Our skilled video editors enhance your raw content, transforming it into engaging and polished videos. With a keen eye for detail, we ensure your videos stand out, leaving a lasting impact on your audience.
                </div>
                {!isTablet && (
                  <div className="service-banner-desktop-btn-wraper">
                    <SecondaryLink
                      path="/ScheduleMeeting"
                      title="Claim Free Consultation"
                    />
                  </div>
                )}
              </div>
              {/* Image First on Mobile (order-1), Second on Desktop (order-md-2) */}
              <div className="service-page-card-wraper">
                <img
                  src="/Images/service/cocoma-banner.jpg"
                  alt="banner-image"
                  className="img-fluid banner-img"
                />
              </div>
            </div>
            {isTablet && (
              <div className="service-banner-desktop-btn-wraper">
                <SecondaryLink
                  path="/ScheduleMeeting"
                  title="Claim Free Consultation"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Section01;
