import "./Edit-Link.css";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";

const EditLink = ({ path,className }) => {
  const user = useSelector((state) => state?.me?.user);

  const handleRedirect = (event) => {
    event.stopPropagation()
    window.open(path, '_blank');
  };

  return (
    user === "admin" && (
      <button className={`edit-link-main ${className}`} onClick={(event) => handleRedirect(event)}>
        <FiEdit size={18} />
      </button>
    )
  )
}

export default EditLink;