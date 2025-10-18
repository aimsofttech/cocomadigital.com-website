import { ADMIN_URL } from "../../../utils";
import EditLink from "../../Edit-Link/Edit-Link";
import "./BriefAndRequirement.css";

export default function BriefAndRequirement({ RequireMentData }) {
  return (
    <div className="brief-and-requirement-main-wraper">
      <div className="brief-and-requirement-main">
        <div className="brief-and-requirement-content">
          <div className="text-center">
            <h1 className="single-video-how-to-edit-title">
              Brief And Requirement
              <EditLink
                path={`${ADMIN_URL}/home/creative_house/creative_house_item/show/${RequireMentData?.id}`} />
            </h1>
          </div>
          <div className="brief-and-requirement-img-wraper text-center">
            <img
              src={RequireMentData?.requirement_logo}
              alt="Requirement logo"
            />
          </div>
          <div className="text-center">
            <p className="invite-for-edit-content-line">
              {RequireMentData?.requirement_description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
