import React from "react";
import "./Section06.css";

const data = [
  {
    img: "../../Images/media.svg",
    title: "Film & Media",
    alt: "Film & Media"
  },
  {
    img: "../../Images/ott.svg",
    title: "OTT / Streaming",
    alt: "OTT / Streaming"
  },
  {
    img: "../../Images/podcast.svg",
    title: "Podcast & Music",
    alt: "Podcast & Music"
  },
  {
    img: "../../Images/edtech.svg",
    title: "EdTech & LMS",
    alt: "EdTech & LMS"
  },
  {
    img: "../../Images/ev.svg",
    title: "eV",
    alt: "eV"
  },
  {
    img: "../../Images/saas.svg",
    title: "SAAS Businesses",
    alt: "SAAS Businesses"
  },
]

export default function Section06() {
  return (
    <div className="home-industries-serve-main-wraper">
      <div className="home-industries-serve-main">
        <div className="row w-100">
          <div className="col-12">
            <center>
              <h3 className="home-industries-serve-title">
                Industries We Serve
              </h3>
            </center>
          </div>
        </div>
        <div className="industries-serve-slider w-100">
          {data?.map((item, index) => {
            return (
              <div key={index} className="col-lg-1 col-md-3 col-sm-5 col-12 industries-serve">
                <img src={item?.img} alt={item?.alt} height={40} />
                <p>{item?.title}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
