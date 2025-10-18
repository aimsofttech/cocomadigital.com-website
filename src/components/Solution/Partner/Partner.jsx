import React from "react";
import "./Partner.css";
// import "react-multi-carousel/lib/styles.css";

const partnerData = [
  {
    id: 1,
    brandImage: "/Images/solution/partner-brand1.svg",
    mainImage: "/Images/solution/partner-card-image.svg",
    para: "Lorem ipsum dolor sit amet consectetur Nulla adipiscing mattis ullamcorper",
    title: "Amazon prime video",
  },
  {
    id: 2,
    brandImage: "/Images/solution/partner-brand2.svg",
    mainImage: "/Images/solution/partner-card-image.svg",
    para: "Lorem ipsum dolor sit amet consectetur Nulla adipiscing mattis ullamcorper",
    title: "Netflix",
  },
  {
    id: 3,
    brandImage: "/Images/solution/partner-brand3.svg",
    mainImage: "/Images/solution/partner-card-image.svg",
    para: "Lorem ipsum dolor sit amet consectetur Nulla adipiscing mattis ullamcorper",
    title: "Disney+",
  },
];

// const responsive = {
//   desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3, partialVisibilityGutter: 40 },
//   tablet: { breakpoint: { max: 1024, min: 464 }, items: 2, partialVisibilityGutter: 30 },
//   mobile: { breakpoint: { max: 464, min: 0 }, items: 1, partialVisibilityGutter: 30 },
// };

const PartnerCarousel = () => {
  return (
    <div className="carousel-wrapper">
      {/* <Carousel
        additionalTransfrom={0}
        arrows
        autoPlay
        autoPlaySpeed={3000}
        infinite
        responsive={responsive}
        showDots={true}
        swipeable
        draggable
        transitionDuration={800}
        slidesToSlide={1}
      > */}
        {partnerData.map((partner) => (
          <div key={partner.id} className="partener-main">
            <img className="partener-border-img" src="/Images/solution/partner1.svg" alt="brand" />
            <img className="partener-brand-img" src={partner.brandImage} alt="brand" />
            <div className="partener-image-content-wraper">
              <img className="partener-card-img" src={partner.mainImage} alt="main" />
              <p className="partener-content-para">{partner.para}</p>
              <h2 className="partener-content-title">{partner.title}</h2>
            </div>
          </div>
        ))}
      {/* </Carousel> */}
    </div>
  );
};

export default PartnerCarousel;
