import { useEffect, useState } from "react";
import "./Home.css";
import { useSelector } from "react-redux";
import adminServiceInstance from "../../Service/apiService";
import Loader from "../../components/common/Loader/Loader";
import Section01 from "../../components/Home/Section01/section01";
import Section02 from "../../components/Home/section02";
// import Section03 from "../../components/Home/section03";
import Section04 from "../../components/Home/Section04/section04";
import Section05 from "../../components/Home/Section05/section05";
import Section06 from "../../components/Home/Section06/section06";
import Section07 from "../../components/Home/Section07/section07";
import Section08 from "../../components/Home/Section08/section08";
import Section09 from "../../components/Home/Section09/Section09";
// import Section11 from "../../components/Home/Section11/section11";
import Section12 from "../../components/Home/Section12/section12";
// import BusinessCareerSection from "../../components/Home/section14/section14";
import ExploreOurServices from "../../components/Home/ExploreServices/services";
import BusinessCareerSection from "../../components/Home/section14/section14";
// import ExploreServices from "../../components/Home/ExploreServices/ExploreServices";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false); // Changed to false temporarily
  const [homeData, setHomeData] = useState({});
  const [allCategories, setAllCategories] = useState({});
  const [error, setError] = useState("");
  const language = useSelector((state) => state?.lang?.lang);

// Fetch home data - TEMPORARILY COMMENTED OUT
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await adminServiceInstance?.Home(language);
        setHomeData(response?.data?.data);
      } catch (err) {
        console.error("API Error:", err); // Added console log
        setError(err?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, [language]);


  // Fetch all categories for Marketing House, Creative House & Services
 useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await adminServiceInstance?.homeAllCategories();
        setAllCategories(response?.data?.data);
      } catch (err) {
        console.error("Categories API Error:", err); // Added console log
        setError(err?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCategories();
 }, [language]);
  

  if (isLoading) {
    return (
      <Loader />
    )
  }

  if (error) {
    return <p className="text-danger">Error: {error}</p>;
  }

  return (
    <>
      <div className="home-main-wraper">
        <div className="home-main">
          {homeData?.top_banner && <Section01 bannerData={homeData?.top_banner} />}
          <Section02/>
          {/* <ExploreServices ServidcesToShow={ServiceData}/> */}
           <ExploreOurServices />
          {/* <Section03  /> */}
          {homeData?.other_service &&
            <Section04 ServicesToShow={homeData?.other_service} />}
          {homeData?.video && <Section05 VideoData={homeData?.video} />}
          <Section06 />
          {homeData?.client && <Section07 ClientData={homeData?.client} />}

          <Section08 marketingHouseCategory={allCategories?.marketing_house_category}
          />
          
          <Section09
            creativeHouseCategory={allCategories?.creative_house_category}
          />

          {/* <Section11 MonthlyPerformanceData={MonthlyPerformanaceData} /> */}
          {homeData?.top_banner?.book_call_template_id &&
            <div className="home-book-call-container-wraper">
              <div className="home-book-call-container">
                <Section12 templateId={homeData?.top_banner?.book_call_template_id} />
              </div>
            </div>
          }
          <BusinessCareerSection />
        </div>
      </div>
    </>
  );
}
