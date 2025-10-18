import "./Solution.css";
import TapSection from "../../components/Solution/TapSection/TapSection";
import { solutionTapData } from "../../utils";
import MarqueeComponent from "../../components/Marquee/Marquee";
import Announcement from "../../components/Solution/Announcement/Announcement";
import Approach from "../../components/Solution/Approach/Approach";
import Partner from "../../components/Solution/Partner/Partner";
import SecondaryLink from "../../components/common/SecondaryLink/SecondaryLink";

const Solution = () => {
  return (
    <>
      <div className="solution-main">
        <div className="solution">
          <div className="tap-section-main">
            <TapSection TapData={solutionTapData} />
          </div>
          <MarqueeComponent />
          <Announcement />
          <div className="line-parent">
            <div className="line-child"></div>
          </div>
          <Approach />
          <h1 className="brand-partner">Brands We've Partnered With</h1>
          <Partner />
          <SecondaryLink
            className="button-title"
            title="Our Expertise"
            path="/"
          />
        </div>
      </div>
    </>
  );
};

export default Solution;
