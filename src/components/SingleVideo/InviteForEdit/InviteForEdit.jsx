import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./InviteForEdit.css";
import { useMediaQuery } from "react-responsive";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

export default function InviteForService({ authorId }) {
  const [authorData, setAuthorData] = useState(null);
  const isMobile = useMediaQuery({
    query: "(max-width: 500px)",
  });

  useEffect(() => {
    if (authorId) {
      fetchAuthorData(authorId);
    }
  }, [authorId]);

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
        const author = result?.data?.author_template?.find(
          (author) => author?.id === authorId
        );
        if (author) {
          setAuthorData(author);
        } else {
          console.warn("No author found with the provided ID.");
        }
      }
    } catch (error) {
      console.error("Error fetching author data:", error);
    }
  };

  return (
    <>
      <div className="invite-for-edit-main-wraper ">
        <div className="invite-for-edit-main">
          <div className="invite-for-edit-img-content-wraper">
            <div className="invite-for-edit-img-wraper">
              <img
                className="w-100"
                src={
                  authorData
                    ? authorData?.author_image
                    : "../../Images/Owner.svg"
                }
                alt={authorData ? authorData?.author_name : "Anil"}
              />
            </div>
            <div className="invite-for-edit-content-wraper">
              {authorData ? (
                <>
                  <h5 className="invite-for-edit-content-line">
                    {authorData?.author_description}{" "}
                    <Link to="/ScheduleMeeting">
                      <span
                        style={{
                          fontWeight: 700,
                          textDecoration: "underline",
                          color: "black",
                        }}
                      >
                        click here
                      </span>
                    </Link>
                  </h5>
                  {!isMobile && (
                    <h5 className="invite-for-edit-content-line">
                      Owner :{" "}
                      <span
                        style={{ fontWeight: 700, textDecoration: "underline" }}
                      >
                        {" "}
                        {authorData?.author_name}
                      </span>{" "}
                      | Founder -{" "}
                      <span
                        style={{ fontWeight: 700, textDecoration: "underline" }}
                      >
                        {authorData?.founder_text}
                      </span>{" "}
                      & CTO -{" "}
                      <span
                        style={{ fontWeight: 700, textDecoration: "underline" }}
                      >
                        {authorData?.cto_text}
                      </span>
                      <EditLink
                        path={`${ADMIN_URL}/template/author/show/${authorData?.id}`} />
                    </h5>
                  )}
                </>
              ) : (
                <h5>Loading author information...</h5>
              )}
            </div>
          </div>
          {isMobile && (
            <h5 className="invite-for-edit-content-line">
              Owner :{" "}
              <span style={{ fontWeight: 700, textDecoration: "underline" }}>
                {" "}
                {authorData?.author_name}
              </span>{" "}
              | Founder -{" "}
              <span style={{ fontWeight: 700, textDecoration: "underline" }}>
                {authorData?.founder_text}
              </span>{" "}
              & CTO -{" "}
              <span style={{ fontWeight: 700, textDecoration: "underline" }}>
                {authorData?.cto_text}
              </span>
              <EditLink
                path={`${ADMIN_URL}/template/author/show/${authorData?.id}`} />
            </h5>
          )}
        </div>
      </div>
    </>
  );
}
