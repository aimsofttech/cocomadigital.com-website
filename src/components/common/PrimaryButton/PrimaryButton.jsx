import { HiArrowUpRight } from "react-icons/hi2";
import "./PrimaryButton.css";

const PrimaryButton = ({
  title,
  path,
  className,
  loading,
  btnClickHandler,
}) => {
  return (
    <button
      type="submit"
      className={`primary-button-main ${className}`}
      onClick={btnClickHandler}
    >
      {title}{" "}
      <HiArrowUpRight
        size={21}
        style={{ color: "#000", fontWeight: "bold", strokeWidth: 1 }}
      />
    </button>
  );
};

export default PrimaryButton;
