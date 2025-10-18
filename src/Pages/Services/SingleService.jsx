import "./service.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RecentlyWorkedWith from "../../components/Services/RecentWork/RecentWork";
import SingleServiceSlider from "../../components/Services/SingleServiceSlider/SingleServiceSlider";
import VideoEditingServices from "../../components/Services/VideoEditingServices/VideoEditingServices";
import { TbShoppingBagPlus } from "react-icons/tb";
import Portfolio from "../../components/Services/ServicePorfolio/ServicePortfolio";
import { useMediaQuery } from "react-responsive";
import adminServiceInstance from "../../Service/apiService";
import Loader from "../../components/common/Loader/Loader";


export default function SingleService() {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState();
  const [otherServices, setOtherServices] = useState(null);
  const [isError, setIsError] = useState("");
  const cartItemCount = useSelector((state) => state.cart.items.length);
  const isMobile = useMediaQuery({
    query: "(max-width: 500px)",
  });


  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await adminServiceInstance?.ServiceDetails(slug);
        setService(response?.data?.data?.services);
        setOtherServices(response?.data?.data?.other_services);
      } catch (err) {
        setIsError(err.message || "Error fetching group services");
        console.error("Error fetching group services:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchServiceDetails();
    }
  }, [slug]);


  if (isLoading) {
    return (
      <Loader />
    )
  }

  if (isError) {
    return <p>{isError }</p>;
  }

  return (
    <>
      {cartItemCount > 0 && !isMobile && (
        <>
          <div className="cart-widget">
            <div className="cart-icon ">
              <p className="cart-text">
                <TbShoppingBagPlus size={30} />
                &nbsp;&nbsp;
                <span className="cart-count">{cartItemCount}</span> <br />
                service
              </p>
            </div>
            <Link to="/cart">
              <button className="schedule-button">Schedule Meeting</button>
            </Link>
          </div>
        </>
      )}

      <SingleServiceSlider service={service} />

      {otherServices &&
        <VideoEditingServices otherServices={otherServices} />}

      {service?.group_single_service_recent_work?.length
        && <RecentlyWorkedWith RecentWorkData={service?.group_single_service_recent_work} />}

  
      {service?.group_single_service_portfolio_category?.length &&
        <Portfolio portfolioCategories={service?.group_single_service_portfolio_category} />
      }

      {/* add to cart for mobile screen */}
      {cartItemCount > 0 && isMobile && (
        <div className="mobile-add-to-cart-wrapper">
          <p className="mobile-add-to-cart-count-icon">
            <TbShoppingBagPlus size={30} />
            &nbsp;&nbsp;
            <span className="cart-count">{cartItemCount}</span> <br />
            service
          </p>
          <Link className="mobile-add-to-cart-link" to="/cart">
            Schedule Meeting
          </Link>
        </div>
      )}

    </>
  );
}
