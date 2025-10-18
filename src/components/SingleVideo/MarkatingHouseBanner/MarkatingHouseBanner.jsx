import React, { useEffect, useState } from "react";
import AdminService from "../../../Service/apiService";
import "./MarkatingHouseBanner.css";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";
import Loader from "../../common/Loader/Loader";

const MarketingHouseBanner = ({ bannerId }) => {
  const [bannerApiData, setBannerApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AdminService.Banners()
      .then((response) => {
        setBannerApiData(response?.data?.data?.banner_title_template);
      })
      .catch((err) => {
        console.log(err.message);
      }).finally(() => {
        setIsLoading(false);
      })
  }, []);

  const matchedBanner = bannerApiData.find((item) => item.id === bannerId);

  if (isLoading) {
    return <Loader />;
  }

  if (!matchedBanner && !isLoading) {
    return <p>No matching banner data found.</p>;
  }

  return (
    <div
      className="w-100"
      style={{
        backgroundImage: `url('${matchedBanner?.banner_bg_img}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "350px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="markating-house-banner-content-wraper">
        <div className="markating-house-banner-content-main">
          <div className="markating-house-banner-left-content">
            <h1>{matchedBanner?.banner_title}
            <EditLink
                path={`${ADMIN_URL}/template/banner_title_template/show/${matchedBanner?.id}`} />
            </h1>
            <p>{matchedBanner?.banner_description}</p>
          </div>
          <div className="markating-house-banner-right-content">
            <h1>
              {matchedBanner?.banner_total_video}
              <span className="plus-above">+</span>
            </h1>
            <p>{matchedBanner?.banner_short_text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingHouseBanner;
