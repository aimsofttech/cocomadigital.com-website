import "./Section08.css";
import MarketingCreative from "../../common/MarketingCreative/MarketingCreative";
import { useEffect, useState } from "react";
import adminServiceInstance from "../../../Service/apiService";
import { useSelector } from "react-redux";

const Section08 = ({ marketingHouseCategory }) => {
  const [activeCategoryId, setActiveCategoryId] = useState(-1);
  const [marketingHouseData, setMarketingHouseData] = useState(null);
  const language = useSelector((state) => state?.lang?.lang);
  
  // Fetch Marketing house card data
useEffect(() => {
  const fetchMarketingHouse = async () => {
    try {
      const params = {
        lang: language,
        category_id: activeCategoryId,
        limit: 10,
        offset: 0,
      };
      const response = await adminServiceInstance?.MarketingHouse(params);
      setMarketingHouseData(response?.data?.data);
    } catch (error) {
      console.log("error", error?.message || "An error occurred while fetching Marketing House data.");
    }
  };

  fetchMarketingHouse();
}, [activeCategoryId, language]);

  return (
    <div className="home-latest-work-main-wraper">
      <div className="home-latest-work-main">
        <MarketingCreative
          categories={marketingHouseCategory}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
          viewAllPath="view-all-series"
          title="Latest work from"
          mainTitle="Our Marketing House"
          cardData={marketingHouseData}
        />
      </div>
    </div>
  );
};

export default Section08;
