import "./Services.css";
import Section01 from "../../components/About/section01/section01";
import Section02 from "../../components/Home/section02";
import Section03 from "../../components/About/section03/section03";
// import Section07 from "../components/About/section07";
// import Section08 from "../components/About/section08";
import Section09 from "../../components/About/section02/section02";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { TbShoppingBagPlus } from "react-icons/tb";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import adminServiceInstance from "../../Service/apiService";
import { useState } from "react";
import Loader from "../../components/common/Loader/Loader";

export default function Services() {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState([]);
  const [services, setServices] = useState([]);
  // const navigate = useNavigate();
  // Get cart item count from Redux store
  const cartItemCount = useSelector((state) => state?.cart?.items?.length);
  const isMobile = useMediaQuery({
    query: "(max-width: 500px)",
  });

  // Immediately redirect if no matching service item found and show error message
  // useEffect(() => {
  //   if (!matchingServiceItem) {
  //     setErrorMessage("Data not found. Redirecting to home page...");
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 2000);
  //   }
  // }, [matchingServiceItem, navigate]);

useEffect(() => {
  const fetchGroupService = async () => {
    setIsLoading(true); // Start loading before API call
    try {
      const response = await adminServiceInstance?.GroupService(slug);
      const servicesData = response?.data?.data?.services;
      setBanner(servicesData?.group_top_banner || null);
      setServices(servicesData?.group_service_category || []);
    } catch (err) {
      setError(err.message || "Error fetching group services");
      console.error("Error fetching group services:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (slug) {
    fetchGroupService();
  }
}, [slug]);
  

    if (isLoading) {
    return (
      <Loader />
    )
  }

  if (error) {
    return <p className="text-danger">Error: {error}</p>;
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
      <div className="w-100 mb-5 d-flex flex-column justify-content-center align-content-center">
        {/* Render the matched banner data */}
        <Section01 bannerData={banner} />
        <Section02 />
        <Section09 />
        {
          services?.map((card, index) => {
            const categoryName = card?.category_name;
            const items = card?.api_group_service_items;
            const id = card?.id;
            const item_id = card?.item_id;
            // Render Section03 only if categoryName and items exist
            return categoryName && items && items?.length > 0 ? (
              <div key={index}>
                <Section03
                  categoryName={categoryName}
                  serviceData={Array.isArray(items) ? items : [items]}
                  id={id}
                  item_id={item_id}
                />
              </div>
            ) : null;
          })
        }

        {/* <Section08 /> */}
        {/* <Section07 /> */}

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

      </div>
    </>
  );
}
