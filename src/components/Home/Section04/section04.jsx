import "./Section04.css";
import { Link } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const Section04 = ({ ServicesToShow }) => {
  // const [activePlatformData, setActivePlatformData] = useState(null);
  // const [activeViewAllData, setActiveViewAllData] = useState(false);

  // const ShowHideMoreDataHandler = () => {
  //   if (activePlatformData.length <= 0) {
  //     setActivePlatformData(servicePlatform?.service_items);
  //   } else {
  //     setActivePlatformData(servicePlatform?.service_items.slice(0, 6));
  //   }
  //   setActiveViewAllData(!activeViewAllData);
  // }

  // Memoize the services list to prevent unnecessary re-renders
  const servicesList = ServicesToShow || [];

  return (
    <div className="home-service-platform-main-wraper">
      <div className="home-service-platform-main">
        <h1 className="home-service-platform-heading">Our Other Services</h1>

        <div className="home-service-platform-card-wraper">
          {servicesList.length > 0 ? (
            servicesList.map((service, index) => (
              <div className="home-service-platform-card" key={service?.id || index}>
                <Link to={`/services/${service?.slug}`}>
                  <img
                    src={service?.service_image}
                    alt={service?.service_title || "Service Image"}
                    className="service-image"
                  />
                  <div className="home-service-platform-card-content-wraper">
                    <h3>{service?.service_title}</h3>
                    <p>
                      <button className="d-lg-block d-md-block">
                        {service?.service_button_text}{" "}
                        <GoArrowUpRight size={20} />
                      </button>
                    </p>
                  </div>
                </Link>

                <div className="position-absolute bottom-0 end-0 mb-2 me-2">
                  <EditLink
                    path={`${ADMIN_URL}/home/service/service_item/show/${service?.id}`}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-5">
              No services available for "Service Platform".
            </p>
          )}
        </div>

        {/* {ServicesToShow?.length > 6 &&
          <button
            className="home-service-show-more-btn"
            onClick={ShowHideMoreDataHandler}
          >
            {!activeViewAllData ? "Show More" : "Hide More"}
            <img src="/Images//home/dropdown-arrow.svg" alt="down arrow icon" />
          </button>
        } */}
      </div>
    </div>
  );
};

export default Section04;
