import { useEffect, useState, useCallback } from "react";
import "./section14.css";
import AdminService from "../../../Service/apiService";
import { ADMIN_URL } from "../../../utils";
import SecondaryLink from "../../common/SecondaryLink/SecondaryLink";
import EditLink from "../../Edit-Link/Edit-Link";

const BusinessCareerSection = () => {
  const [hireUsData, setHireUsData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch Hire Us Data
  const fetchHireUsData = useCallback(async () => {
    try {
      const response = await AdminService?.HireUS();
      const hireUsItems = response?.data?.data?.hire_us || [];
      
      const responseData = hireUsItems?.map((item, index) => ({
        ...item,
        uriLink: index === 0 ? "/ScheduleMeeting" : "/career",
      }));
      
      setHireUsData(responseData);
    } catch (err) {
      setError(err.message || "An error occurred while fetching Hire Us data.");
    }
  }, []);

  useEffect(() => {
    fetchHireUsData();
  }, [fetchHireUsData]);

  if (error) {
    return <p className="text-danger">Error: {error}</p>;
  }

  if (!hireUsData.length) {
    return null; // optionally render a loader or placeholder
  }

  return (
    <div className="business-career-section-main-wraper">
      <div className="business-career-section-main my-5">
        <div className="row g-4">
          {hireUsData.map((item) => (
            <div className="col-md-6" key={item?.id}>
              <div className="business-career-box p-4 rounded position-relative">
                <img
                  src={item?.user_choice_image}
                  alt={item?.user_choice_title || "user-icon"}
                  className="w-100 mb-3 business-card-find-images"
                  loading="lazy"
                />
                <h3 className="business-career-title">{item?.user_choice_title}</h3>
                <p className="home-business-career-text">{item?.user_choice_description}</p>
                <div className="business-career-button-main">
                  <SecondaryLink
                    title={item?.user_choice_button_text}
                    path={item?.uriLink}
                  />
                </div>
                <div className="position-absolute bottom-0 end-0 mb-3 me-3">
                  <EditLink
                    path={`${ADMIN_URL}/template/user_choice/show/${item?.id}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessCareerSection;
