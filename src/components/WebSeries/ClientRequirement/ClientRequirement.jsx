import { useEffect, useState } from "react";
import "./ClientRequirement.css";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const ClientRequirement = ({ itemData }) => {
  const [clientRequirement, setClientRequirement] = useState([]);

  useEffect(() => {
    const requirementsArray = Object.keys(itemData)
      .filter((key) => /^client_requirement_[1-6]$/.test(key))
      .map((key) => itemData[key])
      .filter((value) => value && value.trim() !== "");
    setClientRequirement(requirementsArray);
  }, [itemData]);

  return (
    <>
      <div className="client-requirement-main-wraper">
        <div className="client-requirement-main">
          {clientRequirement?.length > 0 && (
            <section className="client-requirement">
              <div className="client-requirement-title-discription-wraper">
                <h2 className="fw-bold single-web-series-main-title">
                  Client Requirement
                  <EditLink
                      path={`${ADMIN_URL}/home/marketing/marketing_house_item/show/${itemData?.id}`}
                    />
                </h2>
                <h5 className="client-requirement-discription">
                  {itemData?.client_requirement_text}
                </h5>
              </div>
              <div className="client-requirement-card-wraper">
                {clientRequirement?.map((item, index) => {
                  return (
                    <div key={index} className="client-requirement-card">
                      <div className="client-requirement-card-counter-wraper">
                        <h1>{index + 1}</h1>
                      </div>
                      <p className="client-requirement-card-counter">{item}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {/* Team Set Vision: 300M+ Organic Reach */}
          <section className="ideas-strategy-planning-wraper">
            <div className="ideas-strategy-planning-content">
              <h1 className="single-web-series-main-title">
                {itemData?.ideas_strategy_planning_title}
                <EditLink
                      path={`${ADMIN_URL}/home/marketing/marketing_house_item/show/${itemData?.id}`}
                    />
              </h1>
              <p className="ideas-strategy-planning-text">
                {itemData?.ideas_strategy_planning_description}
              </p>
            </div>
            <div className="ideas-strategy-planning-img-wraper">
              <img
                src={itemData?.ideas_strategy_planning_image}
                alt={itemData?.ideas_strategy_planning_title}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ClientRequirement;
