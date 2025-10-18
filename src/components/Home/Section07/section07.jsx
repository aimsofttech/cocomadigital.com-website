import "./Section07.css";
import { Link } from "react-router-dom";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";
import { useMediaQuery } from "react-responsive";
import { GoArrowUpRight } from "react-icons/go";

const Section07 = ({ ClientData }) => {
  // const [clients, setClients] = useState([]);
  // const [showMore, setShowMore] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 576px)" });

  // useEffect(() => {
  //   setClients(ClientData?.client?.slice(0, 6));
  // }, [ClientData]);

  // const handleShowMore = () => {
  //   if (!showMore) {
  //     setClients(ClientData?.client);
  //   } else {
  //     setClients(ClientData?.client?.slice(0, 6));
  //   }
  //   setShowMore(!showMore);
  // };

  // Memoize client list to prevent re-rendering on every parent render
  const clientList = ClientData || [];

  return (
    <div className="home-latest-stories-main-wraper">
      <div className="home-latest-stories-main">
        {/* Section Title */}
        <div className="home-latest-stories-title-subtitle-wraper">
          <h3 className="text-uppercase text-muted home-latest-stories-title">
            Our Clients
          </h3>
          <div className="title-view-all-wrapper">
            <h2 className="home-latest-stories-subtitle">
              Latest Success Stories
            </h2>
            {!isMobile && (
              <Link to="/success-story-view-all" style={{ width: "100px" }}>
                <button className="view-all-button-new">
                  View All{" "}
                  <GoArrowUpRight size={20} style={{ strokeWidth: 1 }} />
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Client Cards */}
        <div className="home-latest-stories-card-wraper">
          {clientList.map((client, index) => (
            <div className="home-latest-stories-card" key={client?.id || index}>
              <Link to={`/client-success-stories/${client?.slug}`}>
                <img
                  src={client?.client_img}
                  alt={client?.client_description || "Client Image"}
                  loading="lazy"
                />
                <p className="card-text fw-bold">{client?.client_title}</p>
              </Link>

              {/* Edit Link for Admin */}
              <div className="position-absolute bottom-0 end-0 mb-2 me-2">
                <EditLink
                  path={`${ADMIN_URL}/home/client/show/${client?.id}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Show Less Button (Commented Out) */}
        {/* {ClientData?.client?.length > 6 && (
          <div className="text-center mt-3">
            <button
              className="home-service-show-more-btn"
              onClick={handleShowMore}
            >
              {!showMore ? "Show More" : "Show Less"}
              <img
                src="/Images/home/dropdown-arrow.svg"
                alt="down arrow icon"
              />
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Section07;
