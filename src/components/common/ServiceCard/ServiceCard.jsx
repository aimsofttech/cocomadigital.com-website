import "./ServiceCard.css";
import { Link } from "react-router-dom";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const ServiceCard = ({ filteredItems }) => {

  return (
    <div className="primary-cards-wraper">
      {filteredItems?.map((item, index) => (
        <div key={index} className="primary-cards">
          <Link to={`web-series-individual/${item?.slug}`}>
            <img
              src={
                item?.poster_image?.startsWith("http")
                  ? item?.poster_image
                  : `https://cocomadigitalmediabucket.s3.eu-north-1.amazonaws.com/creative-house-thumbnail/${item?.poster_image}`
              }
              loading="lazy"
              alt="card-image"
            />
          </Link>
          <div className="position-absolute bottom-0 end-0 mb-2 me-2">
            <EditLink
              path={`${ADMIN_URL}/home/marketing/marketing_house_item/show/${item?.id}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCard;
