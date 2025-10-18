import React from 'react';
import "./ServicesComponent.css";
import { Link } from 'react-router-dom';
import { GoArrowUpRight } from "react-icons/go";

const ServicesComponent = ({ header, data, title }) => {
  console.log("data", data)
  return (
    <div className="container">
        <div className="row mt-5">
           <div className="col-lg-12">
              {/* <center> */}
                <h1 className="all-service-heading-home">
                  {title}
                </h1>
              {/* </center> */}
            </div>
        </div>
      {header?.length > 0 && 
       <div className='home-service-header-wraper'>
        {header?.map((item, index)=>{
        return (
          <h1 
            className='home-service-header-title'  
            key={index}>
            {item}
          </h1>
        )
       })}
       </div>}
    
    {/* Render services for the "Service Platform" category */}
    <div className="row services mt-1">
        {data?.length > 0 ? (
            data?.map((service) => (
            <div className="col-md-6 col-lg-4 col-sm-6  col-xs-6 col-6 mt-2" key={service.id}>
                  <div className="service-card pb-4 text-center">
                    <Link to={`service/${service.id}`} style={{ width: "100%" }}>
                      <img
                        src={service.service_image}
                        alt={service.service_title}
                        className="service-image"
                      />
                    </Link>
                    <h3>{service.service_title}</h3>
                    <Link to={`service/${service.id}`}>
                      <button className="explore-button d-lg-block d-md-block ">
                        {service.service_button_text} <GoArrowUpRight size={20} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center mt-5">
                No services available for "Service Platform".
              </p>
            )}
        </div>
    </div>
  )
}

export default ServicesComponent;