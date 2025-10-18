import AllWebSeries from "../../components/WebSeries/WebSeriesPortfolio";
import WebSeriesGrid from "../../components/WebSeries/WebSeriesGrid";
import "./AllWebseries.css";
import Section12 from "../../components/Home/Section12/section12";
// import RelatedServicesSlider from "../../components/CreativeHouseComponent/relatedServices";

// import CreativeProjects from "../../components/CreativeHouseComponent/CreativeHouseHadder";
const AllWebSeriesPortfolio = () => {
  return (
    <>
      {/* <CreativeProjects /> */}
      <AllWebSeries />
      <WebSeriesGrid />
      <AllWebSeries />
      <WebSeriesGrid />
      <AllWebSeries />
      <WebSeriesGrid />
      {/* <RelatedServicesSlider Haddertitle="Related Services" /> */}
      <div className="home-book-call-container-wraper">
        <div className="home-book-call-container">
          <Section12 />
        </div>
      </div>
      {/* <RelatedServicesSlider Haddertitle="Explore More Film & Media Services" /> */}
    </>
  );
};

export default AllWebSeriesPortfolio;
