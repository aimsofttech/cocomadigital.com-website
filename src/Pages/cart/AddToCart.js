import { useState } from "react";
import { PiCirclesFourLight } from "react-icons/pi";
import { IoReorderFourSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItemFromCart } from "../../Service/redux/cartSlice";
import "./cart.css";
import { useNavigate } from "react-router-dom";

export default function AddToCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state?.cart?.items);
  const [selections, setSelections] = useState({});
  const [viewMode, setViewMode] = useState("CartCard");
  const [message, setMessage] = useState();

  const navigate = useNavigate();

  const handleRemoveFromCart = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleSelectionChange = (id, selectedValue) => {
    setSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        // Toggle the selected value
        [selectedValue]: !prev[id]?.[selectedValue],
      },
    }));
  };

  const onScheduleMeeting = () => {
    const selectedItems = cartItems?.map((item) => ({
      id: item.id,
      group_service_category_id: item?.group_service_category_id,
      selectedValues: selections[item.id] || {},
      subscriptionType: item?.subscriptionType || null,
    }));

    const unselectedItems = selectedItems?.filter(
      (item) =>
        !item.selectedValues.Recurring &&
        !item.selectedValues["One Time Only"] &&
        !item.subscriptionType
    );

    if (unselectedItems.length > 0) {
      setMessage("Please select at least one value for each item.");
      return;
    }

    const payload = selectedItems?.map(
      ({
        id,
        group_service_category_id,
        selectedValues,
        subscriptionType,
      }) => ({
        id,
        group_service_category_id,
        Recurring: selectedValues?.Recurring || subscriptionType === "Recurring",
        OneTimeOnly:
          selectedValues["One Time Only"] ||
          subscriptionType === "One Time Only",
      })
    );

    // console.log("Payload to be sent:", JSON.stringify(payload, null, 2));
    navigate("/ScheduleMeeting", {
      state: {
        cartItems: payload,
      },
    });
  };


  return (
    <div className="container mt-sm-5 mt-3">
      <div className="row">
        <div className="col-lg-6">
          <h1>Your cart of services</h1>
        </div>
        <div className="col-lg-4"></div>
        <div className="col-lg-2 d-flex justify-content-end d-none d-lg-block d-md-block">
          <button
            onClick={() => setViewMode("CartCard")}
            className={`btn add-to-cart-grid-button ${viewMode === "CartCard"
              ? "add-to-cart-grid-button-active"
              : "btn-outline-primary"
              } me-2`}
          >
            <PiCirclesFourLight />
          </button>
          <button
            onClick={() => setViewMode("row")}
            className={`btn add-to-cart-grid-button ${viewMode === "row"
              ? "add-to-cart-grid-button-active"
              : "btn-outline-primary"
              }`}
          >
            <IoReorderFourSharp />
          </button>
        </div>
      </div>

      {cartItems && cartItems?.length > 0 ? (
        <>
          <div className="cart-container mt-4 p-lg-5 p-sm-3 p-2">
            {" "}
            <div className="d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3 align-items-center ">
              {message && (
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              )}
              <button
                className="btn sehedule-meeting-btn"
                onClick={onScheduleMeeting}
              >
                Schedule Meeting <FaArrowRightLong />
              </button>
            </div>
            <div
              className={`row g-3 ${viewMode === "row" ? "flex-column" : ""}`}
            >
              {cartItems?.map((category, index) => (
                <div
                  key={index}
                  className={`${viewMode === "CartCard"
                    ? "col-lg-4 col-md-6 col-sm-12"
                    : "col-12"
                    } d-flex align-items-stretch `}
                >
                  <div className="cart-card-bg w-100 p-3">
                    <div className="d-flex justify-content-between">
                      <h2>{index + 1}</h2>
                      <button
                        className="btn  mb-3"
                        onClick={() => handleRemoveFromCart(category?.id)}
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </div>
                    <div
                      className={`${viewMode === "CartCard" ? "d-block" : "d-flex"
                        }`}
                    >
                      <img
                        src={category?.thumbnailUri}
                        alt={category?.title}
                        className={`${viewMode === "CartCard" ? "cart-img-top" : ""
                          }`}
                      />
                      <div className={`card-body d-flex flex-column ${viewMode === "row" && "ms-3"}`}>
                        <h5 className="card-title">{category?.title}</h5>
                        <p className="card-text">
                          {category?.group_service_item_description2}
                        </p>
                        <div className="d-flex justify-content-between">
                          {/* Recurring Button */}
                          <button
                            className={`btn px-4 ${selections[category?.id]?.Recurring
                              ? "btn-warning"
                              : category?.subscriptionType === "Recurring"
                                ? "btn-warning"
                                : "btn-light"
                              } me-2`}
                            onClick={() =>
                              handleSelectionChange(category?.id, "Recurring")
                            }
                          >
                            Recurring
                          </button>

                          {/* One Time Only Button */}
                          <button
                            className={`btn ${selections[category?.id]?.["One Time Only"]
                              ? "btn-warning"
                              : category?.subscriptionType === "One Time Only"
                                ? "btn-warning"
                                : "btn-light"
                              }`}
                            onClick={() =>
                              handleSelectionChange(
                                category?.id,
                                "One Time Only"
                              )
                            }
                          >
                            One Time Only
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-4 mb-4">
            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}
            <button
              className="btn sehedule-meeting-btn"
              onClick={onScheduleMeeting}
            >
              Schedule Meeting <FaArrowRightLong />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <img
            src="../../Images/EmptyCart.svg"
            alt="Empty Cart"
            className="img-fluid mb-3"
          />
        </div>
      )}
    </div>
  );
}
