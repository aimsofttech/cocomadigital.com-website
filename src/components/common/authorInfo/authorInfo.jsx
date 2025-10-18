import { useEffect, useState } from "react";
import "./authorInfo.css";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

export default function AuthorInfo({ autherId }) {
  const [authorData, setAuthorData] = useState(null);
  const isMobile = useMediaQuery({
    query: "(max-width: 500px)",
  });

  useEffect(() => {
    if (autherId) {
      fetchAuthorData(autherId);
    }
  }, [autherId]);

  const fetchAuthorData = async (authorId) => {
    try {
      const response = await fetch(
        `https://admin.cocomadigital.com/public/api/author`
      );
      if (!response.ok) {
        throw new Error(`Error fetching author data: ${response.status}`);
      }
      const result = await response.json();

      if (
        result.status === "success" &&
        result.data &&
        result.data.author_template
      ) {
        // Find the matching author data by ID
        const author = result.data.author_template.find(
          (author) => author.id === authorId
        );
        if (author) {
          setAuthorData(author);
        } else {
          console.warn("No author found with the provided ID.");
        }
      } else {
        console.warn("Invalid API response structure.");
      }
    } catch (error) {
      console.error("Error fetching author data:", error);
    }
  };

  // Ensure `authorData` is loaded before rendering
  if (!authorData) {
    return <div>Loading author information...</div>;
  }

  return (
    <>
      <div className="auther-info-main">
        <div className="auther-info-main-img-wraper">
          <img src={authorData.author_image} alt="Author" />
        </div>

        <div className="auther-info-main-content-wraper">
          <p style={{ color: "#C1C1C1" }}>
            {authorData.author_description} &nbsp;
            <span>
              <Link
                to="/ScheduleMeeting"
                className="text-warning text-decoration-none text-decoration-underline"
              >
                click here.
              </Link>
            </span>
          </p>

          {!isMobile && (
            <p>
              <strong> Author : </strong>{" "}
              <span className="fw-bold text-warning">
                {authorData.author_name}
              </span>{" "}
              | Founder -{" "}
              <span className="text-warning">{authorData.founder_text}</span> &
              CTO - <span className="text-warning">{authorData.cto_text}</span>
              <EditLink
              path={`${ADMIN_URL}/template/author/show/${authorData?.id}`} />
            </p>
          )}
        </div>
      </div>
      {isMobile && (
        <p style={{marginBottom: "0px"}}>
          <strong> Author : </strong>{" "}
          <span className="fw-bold text-warning">{authorData.author_name}</span>{" "}
          | Founder -{" "}
          <span className="text-warning">{authorData.founder_text}</span> & CTO
          - <span className="text-warning">{authorData.cto_text}</span>
        </p>
      )}
    </>
  );
}
