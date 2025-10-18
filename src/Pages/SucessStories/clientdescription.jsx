import DOMPurify from "dompurify";
import "./client.css";
const ClientDescription = ({ description }) => {
  // Sanitize the HTML
  const sanitizedHTML = DOMPurify.sanitize(description);

  return (
    <div className="client-description">
      <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
    </div>
  );
};

export default ClientDescription;
