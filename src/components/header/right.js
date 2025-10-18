import { MdOutlineArrowOutward } from "react-icons/md";

export default function Right() {
  return (
    <>
      <div className="d-flex">
        <div class="dropdown">
          <button
            style={{ color: "white", fontSize: 18 }}
            class="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            En
          </button>
          <ul class="dropdown-menu">
            <li>
              <button class="dropdown-item" type="button">
                English
              </button>
            </li>
            <li>
              <button class="dropdown-item" type="button">
                Hindi
              </button>
            </li>
            <li>
              <button class="dropdown-item" type="button">
                french
              </button>
            </li>
          </ul>
        </div>
        <div>
          <button className="btn btn-warning">
            Get Started Today <MdOutlineArrowOutward size={25} />
          </button>
        </div>
      </div>
    </>
  );
}
