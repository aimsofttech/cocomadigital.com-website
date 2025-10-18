import { useEffect, useRef } from "react";
import "./MarketingCreative.css";
import SlideNav from "../SlideNav/SlideNav";
import ServiceCard from "../ServiceCard/ServiceCard";
import { Link } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import { useMediaQuery } from "react-responsive";
import PrimaryLink from "../PrimaryLink/PrimaryLink";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const MarketingCreative = ({
  categories,
  activeCategoryId,
  setActiveCategoryId,
  title,
  mainTitle,
  viewAllPath,
  cardData
}) => {
  const cardsContainerScrollRef = useRef(null);
  const isMobile = useMediaQuery({
    query: "(max-width: 576px)",
  });


  useEffect(() => {
    if (cardsContainerScrollRef?.current) {
      cardsContainerScrollRef?.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [activeCategoryId]);

  return (
    <>
      <div className="marketing-creative-main">
        <div className="marketing-creative-title-subtitle-all-wraper">
          <div className="marketing-creative-title-subtitle-wraper">
            <h3 className="text-uppercase text-muted marketing-creative-title">
              {title}
            </h3>
            <h2 className="fw-bold marketing-creative-subtitle">
              {mainTitle}
              <EditLink
                path={`${ADMIN_URL}/home/marketing/marketing_house_category`} />
            </h2>
          </div>
          {!isMobile && (
            <Link to="/view-all-series">
              <button className="view-all-button-new">
                View All <GoArrowUpRight size={20} style={{ strokeWidth: 1 }} />
              </button>
            </Link>
          )}
        </div>
        <div className="home-slide-nav-allcard-main-wraper">
          <SlideNav
            categories={categories}
            activeCategoryId={activeCategoryId}
            setActiveCategoryId={setActiveCategoryId}
          />
          <div
            ref={cardsContainerScrollRef}
            className="home-slide-allcard-wraper"
          >
            <ServiceCard filteredItems={cardData} />
          </div>
        </div>
        {isMobile && <PrimaryLink path={viewAllPath} />}
      </div>
    </>
  );
};

export default MarketingCreative;
