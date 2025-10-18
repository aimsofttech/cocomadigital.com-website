import React from "react";

const CaseStudies = () => {
  const caseStudies = [
    {
      logo: "../../Images/amazon_dark.svg",
      quote: "cocoma is a strategic and insightful partner.",
      growth: "879%",
      name: "Carlo Carli",
      position: "General Manager",
    },
    {
      logo: "../../Images/langistan_dark.svg",
      quote: "The cocoma team is fast, savvy, and truly ahead of the curve.",
      growth: "600%",
      name: "Carlo Carli",
      position: "General Manager",
    },
    {
      logo: "../../Images/amazonminitv_dark.svg",
      quote: "We’ve found the cocoma team to be a passionate partner.",
      growth: "350%",
      name: "Carlo Carli",
      position: "General Manager",
    },
  ];

  return (
    <div className="container my-5">
      <div className="row">
        {caseStudies.map((study, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className=" case-study-card p-3 shadow-sm">
              <div className="text-center">
                <img src={study.logo} alt={study.logo} />
              </div>
              <hr />
              <blockquote className="blockquote mb-4">
                <b>{study.quote}</b>
              </blockquote>
              <p className="text-muted">
                Lorem ipsum dolor sit amet consectetur. Congue tortor tortor in
                natoque quam dictum hendrerit odio aliquam. Risus lorem
                volutpat.
              </p>
              <div className="d-flex align-items-center mt-3">
                <img
                  src="../../Images/carli-testimonial.png.svg"
                  alt={study.name}
                  className="rounded-circle me-3"
                />
                <div>
                  <strong>{study.name}</strong>
                  <br />
                  <span className="text-muted">{study.position}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className=" mb-1">↑ {study.growth}</h3>
                <p className="">See how we grew {study.growth} →</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="text-center mt-4">
        <button className="btn btn-dark p-3">See More Case Studies</button>
      </div> */}
    </div>
  );
};

export default CaseStudies;
