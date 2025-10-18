import { useEffect, useState } from "react";
import "./AllWebseries.css";
import SingleWebSeriesData from "../../components/WebSeries/SingleWebSeriesData/SingleWebSeriesData";
import Section02 from "../../components/Home/section02";
import ClientRequirement from "../../components/WebSeries/ClientRequirement/ClientRequirement";
import OtherActivities from "../../components/WebSeries/OtherActivities/OtherActivities";
import ContentCreateByTeam from "../../components/WebSeries/ContentCreateByTeam/ContentCreateByTeam";
// import RelatedServicesSlider from "../../components/CreativeHouseComponent/relatedServices";
import Section12 from "../../components/Home/Section12/section12";
import ProjectSuccess from "../../components/WebSeries/ProjectSuccess/ProjectSucess";
import { useParams } from "react-router-dom";
// import BusinessCareerSection from "../../components/Home/section14";
import ContinuityProgram from "./ContinuityProgram/ContinuityProgram";
import adminServiceInstance from "../../Service/apiService";
import Loader from "../../components/common/Loader/Loader";
import HiringCard from "../../components/WebSeries/HireingCard/HireingCart";

const WebSeriesIndividual = () => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [itemData, setItemData] = useState(null);


  useEffect(() => {
    const fetchMarketingHouseDetails = async () => {
      try {
        const response = await adminServiceInstance?.MarketingHouseDetails(slug);;
        setItemData(response?.data?.data)
      } catch (err) {
        setIsError(err.message || "Error fetching group services");
        console.error("Error fetching group services:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchMarketingHouseDetails();
    }
  }, [slug]);


  if (isLoading) {
    return (
      <Loader />
    )
  }

  if (isError) {
    return <p>{isError}</p>;
  }

  return (
    <>
      {itemData &&
        <div className="w-100 d-flex flex-column justify-content-center align-content-center mb-5">
          <SingleWebSeriesData itemData={itemData} />
          <Section02 />
          <ClientRequirement itemData={itemData} />
          <HiringCard itemData={itemData} />
          <OtherActivities itemData={itemData} />
          <ContentCreateByTeam itemData={itemData} />
          <ContinuityProgram itemData={itemData} />
          <div className="marketing-house-success-section-main-wraper">
            <div className="marketing-house-success-section-container">
              <ProjectSuccess />
            </div>
          </div>

          {/* <RelatedServicesSlider Haddertitle="Related Services" /> */}

          <div className="home-book-call-container-wraper">
            <div className="home-book-call-container">
              <Section12
                templateId={itemData?.book_call_id}
              />
            </div>
          </div>

          {/* <RelatedServicesSlider Haddertitle="Explore More Film & Media Services" /> */}
          {/* <BusinessCareerSection /> */}
        </div>
      }
      {!itemData && !isLoading && !isError && <p>No data found</p>}
    </>
  );
};

export default WebSeriesIndividual;
