import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ClientDescription from "./clientdescription";
import adminServiceInstance from "../../Service/apiService";
import Section12 from "../../components/Home/Section12/section12";
import InviteForService from "../../components/SingleVideo/InviteForEdit/InviteForEdit";
import Loader from "../../components/common/Loader/Loader";
// import EditLink from "../../components/Edit-Link/Edit-Link";
// import { ADMIN_URL } from "../../utils";

const ClientPage = () => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { slug } = useParams();

  useEffect(() => {
    const fetchSuccessStoryDetails = async () => {
      try {
        const response = await adminServiceInstance?.ClientSuccessStoryDetails(slug);
        setClientData(response?.data?.data);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchSuccessStoryDetails();
  }, [slug]);

  if (loading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h1 className="text-danger">{error}</h1>
        <p className="text-muted">
          We couldn’t find the client data you’re looking for.
        </p>
        <Link to="/clients" className="btn btn-secondary mt-3">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="client-main-wrapper">
      <InviteForService authorId={clientData?.author_id} />
      <div className="shadow-lg client-main">
        {/* <div className="client-banner-wrapper position-relative">
          <img
            src={clientData?.image || "https://via.placeholder.com/800x400"}
            alt={clientData?.title}
          />
          <div className="position-absolute top-0 end-0 mt-1 me-2">
          <EditLink
           path={`${ADMIN_URL}/home/client/show/${clientData?.id}`} 
           />
          </div>
        </div> */}
        {/* Content Section */}
        <ClientDescription description={clientData?.description} />
      </div>
      <div className="home-book-call-container-wraper">
        <div className="home-book-call-container">
          <Section12 templateId={clientData?.book_call_id} />
        </div>
      </div>
    </div>
  );
};
export default ClientPage;
