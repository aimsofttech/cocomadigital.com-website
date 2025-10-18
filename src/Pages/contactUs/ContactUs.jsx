import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import CaseStudies from "../../components/Contact_us/CaseStudy";
import "./contact.css";
import { FaPhoneAlt } from "react-icons/fa";
import AdminService from "../../Service/apiService";
import ReactPlayer from "react-player";
import PrimaryButton from "../../components/common/PrimaryButton/PrimaryButton";

export default function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    phone_no: "",
    company_name: "",
    media_budget: "",
    message: "",
  });

  // const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // setResponseMessage("");
    try {
      const response = await AdminService.ContactUs(formData);
      // setResponseMessage(
      //   response.data.message || "Form submitted successfully!"
      // );
      // Redirect to Thank You page
      if (response) {
        navigate("/thank-you", {
          state: {
            date: null,
            time: null,
            successMessage: "Form submitted successfully!",
            cartItems: null,
            timeZone: null,
          },
        });
      }
      setFormData({
        first_name: "",
        email: "",
        phone_no: "",
        company_name: "",
        media_budget: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container w-100 contact-us-main">
        <div className="row w-100">
          <div className="mt-3 text-end">
            <button className="btn text-center contact-us-top-button">
              <span className="btn-inner-phone">
                <FaPhoneAlt size={20} />
              </span>
              {/* <span className="btn-inner-text">Contact Us</span> */}
            </button>
          </div>
        </div>
        <div className="row sm:mt-5 mt-4 mb-5 w-100">
          <div className="col-md-6 col-12 order-lg-1 order-md-1 order-2 mt-md-0 mt-4">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=OyxfDB5_F44"
              playing
              loop
              muted
              controls={false}
              width="100%"
              // height="100%"
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    controls: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    rel: 0,
                    fs: 0,
                  },
                },
              }}
            />
            <div className="pt-4">
              <h3>
                Ready to meet your
                <br /> Growth Partner?
              </h3>
              <p className="mt-sm-4 mt-3">
                We seek lasting relationships to help our clients unlock rapid
                growth at efficient economics. Tell us where you are and where
                you want to be.
              </p>
            </div>
          </div>
          <div className="col-md-6 col-12 order-lg-2 order-md-2 order-1">
            <div className="contact-us-container pt-5">
              <center>
                <h2>Welcoming serious inquiries.</h2>
              </center>
              {/* {responseMessage && (
                <p className="text-success text-center">{responseMessage}</p>
              )} */}
              {error && <p className="text-danger text-center">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mt-4">
                  <label className="form-label">
                    Full Name<span className="validation-icon">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="form-control form-control-contactus"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="form-label">
                    Work Email<span className="validation-icon">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control form-control-contactus"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="form-label">
                    Phone Number<span className="validation-icon">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    className="form-control form-control-contactus"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="form-label">
                    Company Name<span className="validation-icon">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="form-control form-control-contactus"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="form-label">
                    Monthly Budget<span className="validation-icon">*</span>
                  </label>
                  <input
                    type="text"
                    name="media_budget"
                    value={formData.media_budget}
                    onChange={handleChange}
                    className="form-control form-control-contactus"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="form-label">
                    Your Message<span className="validation-icon">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control form-control-contactus"
                    required
                  ></textarea>
                </div>
                <div className="d-flex mt-4">
                  {/* <div>
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter === "1"}
                      onChange={handleChange}
                      className="form-check-input form-checkbox-custom p-2"
                    />
                  </div>
                  <label className="form-label ms-3">
                    Yes, I want to experience the greatest growth newsletter on
                    the internet.
                  </label> */}
                </div>
                <div className="mt-4 text-center w-100">
                  {/* <button
                    type="submit"
                    className="btn m-auto btn-Submit-your-message"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Your Message"}
                  </button> */}
                  <PrimaryButton
                    title="Submit Your Message"
                    loading={loading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <div className="row">
          <CaseStudies />
        </div> */}
      </div>
    </>
  );
}
