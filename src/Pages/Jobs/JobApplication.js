import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminServiceInstance from "../../Service/apiService";

const JobApplicationForm = () => {
  const { slug } = useParams(); // Get job_id from URL
  const navigate = useNavigate(); // Initialize navigation

  const initialFormState = {
    first_name: "",
    last_name: "",
    phone_no: "",
    email: "",
    experience: "",
    linkedin_profile: "",
    annual_ctc: "",
    job_preference: "",
    notice_period_days: "",
    portfolio_link: "",
    upload_resume: null, // File upload
  };

  const [formData, setFormData] = useState(initialFormState);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, upload_resume: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const submissionData = new FormData();
    submissionData.append("job_slug", slug); // Append slug from URL
    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });

    try {
      const response = adminServiceInstance?.JobApplication(submissionData);

      if (response) {
        // Clear form
        setFormData(initialFormState);

        // Redirect to Thank You page
        navigate("/thank-you");

      }

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Job Application</h2>
        <p className="text-muted">Tell us more about you so we can get back to you.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <input type="text" name="phone_no" className="form-control" value={formData.phone_no} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Experience (years)</label>
            <input type="text" name="experience" className="form-control" value={formData.experience} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">LinkedIn Profile</label>
            <input type="text" name="linkedin_profile" className="form-control" value={formData.linkedin_profile} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Annual CTC</label>
            <input type="text" name="annual_ctc" className="form-control" value={formData.annual_ctc} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Job Preference</label>
            <select name="job_preference" className="form-select" value={formData.job_preference} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Full time">Full Time</option>
              <option value="Part time">Part Time</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Notice Period (days)</label>
            <input type="text" name="notice_period_days" className="form-control" value={formData.notice_period_days} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Portfolio Link</label>
            <input type="text" name="portfolio_link" className="form-control" value={formData.portfolio_link} onChange={handleChange} required />
          </div>
          <div className="col-md-12">
            <label className="form-label">Upload Resume</label>
            <input type="file" name="upload_resume" className="form-control" onChange={handleFileChange} required />
          </div>
          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-dark btn-lg px-5">Apply Now</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;
