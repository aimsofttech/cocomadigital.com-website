import { useEffect, useState } from "react";
import CreativeProjects from "../../components/CreativeHouseComponent/CreativeHouseHadder";
import CreativeHouseProject from "../../components/CreativeHouseComponent/CreativePorject";
// import RelatedServicesSlider from "../../components/CreativeHouseComponent/relatedServices";
import Section12 from "../../components/Home/Section12/section12";
import BusinessCareerSection from "../../components/Home/section14/section14";
import adminServiceInstance from "../../Service/apiService";
import Loader from "../../components/common/Loader/Loader";

export default function CreativeHouse() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [creativeHouseDetails, setCreativeHouseDetails] = useState(null);

  useEffect(() => {
    const fetchCreativeHouseDetails = async () => {
      try {
        const response = await adminServiceInstance.CreativeHouseDetails();
        setCreativeHouseDetails(response?.data?.data);
      } catch (err) {
        setIsError(err?.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreativeHouseDetails();
  }, []);


  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <CreativeProjects bannerId={creativeHouseDetails?.creative_house_projects?.banner_title_template_id} />
      <CreativeHouseProject creativeCategory={creativeHouseDetails?.creativeCategory} />
      {/* <RelatedServicesSlider Haddertitle="related Services" /> */}
      <div className="home-book-call-container-wraper">
        <div className="home-book-call-container">
          <Section12
            templateId={
              creativeHouseDetails?.creative_house_projects?.banner_title_template_id
            }
          />
        </div>
      </div>
      {/* <RelatedServicesSlider Haddertitle="Explore More Film & Media Services" /> */}
      <BusinessCareerSection />
    </>
  );
}
