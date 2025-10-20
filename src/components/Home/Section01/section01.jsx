import "./Section01.css";
import ReactPlayer from "react-player";
import SecondaryLink from "../../common/SecondaryLink/SecondaryLink";
import EditLink from "../../Edit-Link/Edit-Link";
import OptimizedHeroImage from "../../common/OptimizedHeroImage/OptimizedHeroImage";
import { ADMIN_URL } from "../../../utils";

export default function Section01({ bannerData }) {
  const { banner_video_url, heading, sub_heading, banner_button_text, id } = bannerData || {};

  return (
    <div className="container-fluid">
      <div className="row align-items-center">
        {/* Video Section (Mobile First) */}
        <div
          className="col-sm-6 col-12 order-sm-2 order-1"
          style={{
            padding: 0,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
          }}
        >
          <div
            className="section-image-01"
            style={{ position: "relative", width: "100%", overflow: "hidden" }}
          >
            {/* 🎯 ULTIMATE CLS FIX: width/height attributes + fetchpriority for fastest LCP! */}
            <img 
              src={`${process.env.PUBLIC_URL}/Images/service/cocoma-banner.webp`}
              alt="Hero Banner - Cocoma Digital Services"
              width="1920"
              height="1080"
              fetchpriority="high"
              loading="eager"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0
              }}
              onError={(e) => {
                console.error('🔴 IMAGE LOAD ERROR:', e.target.src);
                console.error('🔴 Full URL attempted:', window.location.origin + e.target.src);
                console.error('🔴 PUBLIC_URL:', process.env.PUBLIC_URL);
                e.target.style.border = '5px solid red';
                e.target.alt = 'IMAGE FAILED TO LOAD: ' + e.target.src;
              }}
              onLoad={(e) => {
                console.log('✅ IMAGE LOADED SUCCESSFULLY:', e.target.src);
                console.log('✅ Full URL:', window.location.origin + e.target.getAttribute('src'));
              }}
            />
            {banner_video_url && (
              <ReactPlayer
                url={banner_video_url}
                playing
                loop
                muted
                controls={false}
                width="100%"
                height="100%"
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      controls: 0,
                      showinfo: 0,
                      iv_load_policy: 3,
                      rel: 0,
                      fs: 0,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Text Section */}
        <div className="col-sm-6 col-12 order-sm-1 order-2 home-section-content-wraper">
          <div className="section-heading-01">
            {heading}
            <EditLink path={`${ADMIN_URL}/home/top_banner/show/${id}`} />
          </div>
          <div className="section-title-01">{sub_heading}</div>

          <div className="desktop-home-button-wraper mt-2">
            {/* Commented button code preserved */}
            {/* 
            <button className="meeting-button-wraper">
              <Link to={"/ScheduleMeeting"} className="meeting-button">
                {bannerData?.top_banner?.banner_button_text}{" "}
                <HiArrowUpRight size={22} style={{ color: "#000", fontWeight: "bold", strokeWidth: 1 }} />
              </Link>
            </button>
            */}
            {banner_button_text && (
              <SecondaryLink path="/ScheduleMeeting" title={banner_button_text} />
            )}
          </div>
        </div>
      </div>

      <div className="home-tablet-btn">
        {/* Commented button code preserved */}
        {/* 
        <button className="meeting-button-wraper">
          <Link to={"/ScheduleMeeting"} className="meeting-button">
            {bannerData?.top_banner?.banner_button_text}{" "}
            <HiArrowUpRight size={22} style={{ color: "#000", fontWeight: "bold", strokeWidth: 1 }} />
          </Link>
        </button>
        */}
        {banner_button_text && (
          <SecondaryLink path="/ScheduleMeeting" title={banner_button_text} />
        )}
      </div>
    </div>
  );
}
