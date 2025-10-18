import { useEffect, useState, useCallback } from "react";
import "./Section12.css";
import AdminService from "../../../Service/apiService";
import SecondaryLink from "../../common/SecondaryLink/SecondaryLink";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const Section12 = ({ templateId }) => {
  const [bookCall, setBookCall] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const isMobile = useMediaQuery({ query: "(max-width: 500px)" });
  const id = templateId || 1;

  // Fetch BookCall data
  const fetchBookCallData = useCallback(async () => {
    try {
      const response = await AdminService.BookACall(id);
      const bookCallData = response?.data?.data?.book_call?.[0] || null;
      setBookCall(bookCallData);
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchBookCallData();
  }, [id, fetchBookCallData]);

  // Error state
  if (error) return <p className="text-danger">Error: {error}</p>;

  // No data state
  if (!bookCall) return <p>No data found.</p>;

  return (
    <div className="home-book-call-main">
      <div className="home-book-call-img-wraper">
        {!location?.pathname?.startsWith("/client-success-stories") && (
          <img src={bookCall?.book_image} alt="Book A Call" loading="lazy" />
        )}
        {location?.pathname?.startsWith("/client-success-stories") && !isMobile && (
          <img src={bookCall?.book_image} alt="Book A Call" loading="lazy" />
        )}

        <div className="res-home-book-call-btn-wraper">
          <SecondaryLink title={bookCall?.book_button_text} path="/ScheduleMeeting" />
        </div>
      </div>

      <div className="home-book-call-content-wraper">
        <h2 className="home-book-call-content-main-title">{bookCall?.book_heading}</h2>

        <div>
          <h5 className="home-book-call-content-title">{bookCall?.book_title1}</h5>
          <p className="home-book-call-content-description">{bookCall?.book_description1}</p>
        </div>

        <div>
          <h5 className="home-book-call-content-title">{bookCall?.book_title2}</h5>
          <p className="home-book-call-content-description">{bookCall?.book_description2}</p>
        </div>

        <div className="home-book-call-btn-wraper">
          <div style={{ minWidth: "350px" }}>
            <SecondaryLink title={bookCall?.book_button_text} path="/ScheduleMeeting" />
          </div>
        </div>
      </div>

      <div className="position-absolute top-0 end-0 mt-2 me-2">
        <EditLink path={`${ADMIN_URL}/template/book_call/show/${bookCall?.id}`} />
      </div>
    </div>
  );
};

export default Section12;
