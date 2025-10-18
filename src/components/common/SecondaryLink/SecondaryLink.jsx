import { Link } from "react-router-dom";
import { HiArrowUpRight } from "react-icons/hi2";
import "./SecondaryLink.css";

const SecondaryLink = ({ title, path, className }) => {
  return (
    <Link to={path} className={`secondary-link-main ${className}`}>
      {title}{" "}
      <HiArrowUpRight
        size={21}
        style={{ color: "#000", fontWeight: "bold", strokeWidth: 1 }}
      />
    </Link>
  );
};

export default SecondaryLink;
