import { useParams } from "react-router-dom";
import Section12 from "../../components/Home/Section12/section12";
import BriefAndRequirement from "../../components/SingleVideo/BriefAndRequirement/BriefAndRequirement";
import CreativeHouseServices from "../../components/SingleVideo/CreativeHouseServices/CreativeHouseServices";
import CreativeSlider from "../../components/SingleVideo/CreativeSlider/CreativeSlider";
import FinalOutput from "../../components/SingleVideo/FinalOutput/FinalOutput";
import HowWeEdit from "../../components/SingleVideo/HowWeEdit/HowWeEdit";
import InviteForService from "../../components/SingleVideo/InviteForEdit/InviteForEdit";
import "./videoediting.css";
import { useEffect, useState } from "react";
import adminServiceInstance from "../../Service/apiService";
import Loader from "../../components/common/Loader/Loader";
// import AuthorInfo from "../../components/common/authorInfo";


export default function SingleVideo() {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState("");
  const [singleVideoData, setSingleVideoData] = useState(null);
  const [allCategories, setAllCategories] = useState(null);



  useEffect(() => {
    const fetchSingleVideo = async () => {
      try {
        const response = await adminServiceInstance?.CreativeSingleVideo(slug);
        console.log("fetchSingleVideo", response?.data?.data);
        setSingleVideoData(response?.data?.data?.creative_house);
        setAllCategories(response?.data?.data?.category);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchSingleVideo();
    }
  }, [slug]);


  if (isLoading) {
    return (
      <Loader />
    )
  }

  if (isError) {
    <p>{isError}</p>
  }


  return (
    <>
      <InviteForService authorId={singleVideoData?.author_id} />
      <HowWeEdit data={singleVideoData} />
      <BriefAndRequirement RequireMentData={singleVideoData} />
      {singleVideoData?.creative_house_approach?.length > 0 && (
        <CreativeSlider
          CreativeSliderData={singleVideoData?.creative_house_approach}
        />
      )}
      {singleVideoData?.creative_house_final_output?.length > 0 && (
        <FinalOutput FinalOutputData={singleVideoData} />
      )}
      <div className="home-book-call-container-wraper">
        <div className="home-book-call-container">
          <Section12
            templateId={
              singleVideoData?.book_call_id
            }
          />
        </div>
      </div>
      <CreativeHouseServices
        serviceData=""
        allCategories={allCategories}
      />
    </>
  );
}
