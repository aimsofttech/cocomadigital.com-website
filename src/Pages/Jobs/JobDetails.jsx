import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ADMIN_URL, jobTypeData } from "../../utils";
import EditLink from "../../components/Edit-Link/Edit-Link";
import AdminService from "../../Service/apiService";
import Loader from "../../components/common/Loader/Loader";

const JobDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState(null);
  const [jobList, SetJobList] = useState();


  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await AdminService?.JobDetails(slug);

        SetJobList(response?.data?.data);
      } catch (err) {
        setError(err.message || "Failed to fetch job data");
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobData();
  }, [slug]);


  if (loadingJobs)
    return (
      <Loader />
    );
  
if (error) {
  return <h1 style={{ color: "red" }}>{error}</h1>;
}


  if (!jobList) {
    return (
      <div className="container py-5">
        <h2 className="text-center text-danger">Job not found</h2>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button className="btn btn-dark" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <div className="container py-5">
        {/* Job Title Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-bottom pb-3 mb-4">
          <div>
            <h1 className="fw-bold">{jobList?.title}
              <EditLink
                path={`${ADMIN_URL}/job_list/show/${jobList?.id}`}
              />
            </h1>
            <p className="mb-1">
              <strong>Location:</strong> {jobList?.location}
            </p>
            <p className="mb-1">
              <strong>Job Type:</strong> {jobTypeData[jobList?.job_type]}
            </p>
            <p className="mb-0">
              <strong>Salary:</strong> Negotiable
            </p>
          </div>
          <Link
            to={`/job-application/${jobList?.slug}`}
            className="btn btn-dark mt-3 mt-md-0"
          >
            Apply Now
          </Link>
        </div>
        <section className="mb-5">
          <div
            dangerouslySetInnerHTML={{ __html: jobList?.description }}
            className="mt-3 border-top pt-2 job-details-content"
          ></div>
        </section>

        {/* Footer Section */}
        <div className="text-center border-top pt-4">
          <h3 className="fw-bold mb-3">Get to know us and join our team</h3>
          <Link
            to={`/job-application/${jobList?.slug}`}
            className="btn btn-dark btn-lg"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
