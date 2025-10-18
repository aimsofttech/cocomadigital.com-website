import Marquee from "react-fast-marquee";
import EditLink from "../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../utils";
import { useSelector } from "react-redux";

export default function Section02() {
  const brands = useSelector(
    (state) => state?.commonApi?.commonApi?.data?.brands
  ) || [];

  if (!brands.length) return null;

  return (
    <div className="trusted-brand">
      <center>
        <h4
          className="all-service-heading-home pt-3 pb-3"
          style={{ color: "white", textTransform: "uppercase" }}
        >
          <span>Trusted by Leading Brands Worldwide</span>
          <EditLink path={`${ADMIN_URL}/template/brands`} />
        </h4>
      </center>

      <Marquee className="mt-3 mb-3" pauseOnHover gradient={false}>
        {brands.map(({ brand_image, brand_name }, index) => (
          <img
            key={index}
            src={brand_image}
            alt={brand_name || "Brand Logo"}
          />
        ))}
      </Marquee>
    </div>
  );
}
