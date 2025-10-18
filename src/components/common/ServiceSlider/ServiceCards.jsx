import { useCallback } from "react";
import "./ServiceCards.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../../Service/redux/cartSlice";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const ServiceCards = ({ data }) => {
  const cartItems = useSelector((state) => state?.cart?.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isItemInCart = (itemId) => {
    return cartItems.some((cartItem) => cartItem.id === itemId);
  }

  const serviceDetailsPageRedirect = useCallback((slug) => {
    navigate(`/service-details/${slug}`)
  }, [navigate]);

  const handleToggleCart = (event, item) => {
    event.stopPropagation();
    if (isItemInCart(item?.id)) {
      dispatch(removeItemFromCart(item?.id));
    } else {
      const itemWithCategory = {
        ...item,
        group_service_category_id: item?.id,
        subscriptionType: "One Time Only",
      };
      dispatch(addItemToCart(itemWithCategory));
    }
  };

  return (
    <div
      className="service-cards-main rounded-lg shadow-md"
      onClick={() => serviceDetailsPageRedirect(data?.slug)}
    >
      <>
        <div className="service-cards-img-wrapper">
          <img src={data?.thumbnail} alt={data?.title || "Service Image"} className="w-full h-40 object-cover" />
        </div>
        <div className="service-cards-content-wrapper">
          <h3
            className="service-cards-content-title">
            {data?.title}
          </h3>
          <p
            className={`service-cards-content-description`}
          >
            {data?.description}
          </p>
          <div className="add-explore-btn-wrapper">
            <button
              className={`w-50 service-cards-content-explore-btn`}>
              Explore More
            </button>
            <button
              onClick={(e) => handleToggleCart(e, data)}
              className={`w-50 service-cards-content-btn ${isItemInCart(data?.id) ? "btn-warning" : "btn-dark"
                }`}
            >
              {isItemInCart(data?.id) ? "Remove" : "Add Now"}
            </button>
          </div>
        </div>
      </>
      <span
        className="position-absolute top-0 end-0 mt-2 me-2 pb-1 pe-1 d-flex justify-content-center align-content-center"
        style={{backgroundColor: "white"}}
       >
        <EditLink
          path={`${ADMIN_URL}/home/group/service/group_service_item/show/${data?.id}`} />
      </span>
    </div>
  );
};


export default ServiceCards;