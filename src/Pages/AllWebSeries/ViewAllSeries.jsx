import { useEffect, useState } from "react";
import "./AllWebseries.css";
import Section12 from "../../components/Home/Section12/section12";
// import RelatedServicesSlider from "../../components/CreativeHouseComponent/relatedServices";
// import CreativeProjects from "../../components/SingleVideo/";
// import AllSeriesData from "../../components/WebSeries/AllSeriesData";
// import HireingCard from "../../components/WebSeries/HireingCart";
import ProjectSucess from "../../components/WebSeries/ProjectSuccess/ProjectSucess";
// import Section11 from "../../components/Home/section11";
import AdminService from "../../Service/apiService";
import AllSeriesData from "../../components/WebSeries/AllSeriesData/AllSeriesData";
import MarketingHouseBanner from "../../components/SingleVideo/MarkatingHouseBanner/MarkatingHouseBanner";
import Loader from "../../components/common/Loader/Loader";

const ViewAllSeries = () => {
  const [marketingCategory, setMarketingCategory] = useState([]);
  const [marketingYear, setMarketingYear] = useState([]);
  const [ViewAllSeriesId, setViewAllSeriesId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllCategoryData = async () => {
      try {
        const response = await AdminService?.getAllCategory();
        setMarketingCategory(response?.data?.data?.marketingCategory);
        setMarketingYear(response?.data?.data?.marketingYear);
        setViewAllSeriesId(response?.data?.data?.marketing_house_projects);
      } catch (error) {
        console.log("Error", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCategoryData();
  }, []);

  if (isLoading) {
    return <Loader/>;
  }

  return (
    <>
      {/* <CreativeProjects bannerData={CreativeHouseData} /> */}
      <MarketingHouseBanner
        bannerId={ViewAllSeriesId?.banner_title_template_id}
      />
      <div className="vill-all-series-content-wraper">
        <div className="vill-all-series-content">
          <AllSeriesData
            marketingCategory={marketingCategory}
            marketingYear={marketingYear}
          />
          {/* <RelatedServicesSlider Haddertitle="Related Services" /> */}
          <Section12
            templateId={
              ViewAllSeriesId?.setViewAllSeriesId?.book_call_template_id
            }
          />
          {/* <Section11 /> */}
          {/* <RelatedServicesSlider Haddertitle="Explore More Film & Media Services" /> */}
          <ProjectSucess />
        </div>
      </div>
    </>
  );
};

export default ViewAllSeries;
