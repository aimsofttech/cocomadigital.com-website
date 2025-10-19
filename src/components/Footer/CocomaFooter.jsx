import "./footer.css";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SelectLang from "../selectLang/selectLang";

export default function CocomaFooter() {
  const { service_item = [], other_service = [] } = useSelector((state) => state?.commonApi?.commonApi?.data || {});
  const cartItemCount = useSelector((state) => state?.cart?.items?.length);

  return (
    <>
      <div
        className={`container-fluid footer-main pt-5 ${cartItemCount > 0 ? "paddingBottom-60" : ""
          }`}
      >
        <div className="container">
          <div className="footer-logo-social-media-wrapper">
            <img
              className="footer-logo"
              src="../../Images/logoWhite.svg"
              alt="logo"
            />
            <div className="footer-social-media-wrapper">
              <div className="social-icon">
                <Link
                  to="https://wa.me/+918655643377?text=Hello,%20I%20need%20more%20information."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp
                    className="social-icon-main"
                    color="black"
                    size={50}
                  />
                </Link>
              </div>
              <div className="social-icon">
                <Link
                  to="https://www.instagram.com/cocomadigital/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram
                    className="social-icon-main"
                    color="black"
                    size={50}
                  />
                </Link>
              </div>{" "}
              <div className="social-icon">
                <Link
                  to="https://www.facebook.com/Cocoma-Digital-Private-Limited-107521348660701=pages_you_manage"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF
                    className="social-icon-main"
                    color="black"
                    size={50}
                  />
                </Link>
              </div>{" "}
              <div className="social-icon">
                <Link
                  to="https://www.youtube.com/channel/UCP3vqjxVD4VlLxDWiKeq1Mg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube
                    className="social-icon-main"
                    color="black"
                    size={50}
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="w-100 mt-5 footer-lang-content-wrapper">
            <div className="footer-menu-item mobile-screen-lang-select">
              <SelectLang />
            </div>
            <div className="footer-menu-item-wrapper">
              <div className="footer-menu-item">
                <ul style={{ paddingLeft: "0px", paddingBottom: "0px" }}>
                  <li className="pb-1">
                    <h4>Services</h4>
                  </li>
                  {
                    service_item?.map((item, index) => (
                      <li key={index} className="my-2">
                        <Link to={`/services/${item?.slug}`}>
                          {item?.service_title}
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </div>

              <div className="footer-menu-item">
                <ul style={{ paddingLeft: "0px", paddingBottom: "0px" }}>
                  <li className="pb-1">
                    <h4>By Platform</h4>
                  </li>
                  {other_service?.map((item, index) => (
                    <li key={index} className="my-2">
                      <Link to={`/services/${item?.slug}`}>{item?.service_title}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-menu-item">
                <ul style={{ paddingLeft: "0px", paddingBottom: "0px" }}>
                  <li className="pb-1">
                    <h4>Cocoma Digital</h4>
                  </li>
                  <li className="my-2">
                    <Link to="/about-us"> About Us </Link>
                  </li>
                  <li className="my-2">
                    {" "}
                    <Link to={"/contact-us"}>Contact us</Link>
                  </li>
                  <li className="my-2">
                    <Link to={"/career"}>Career at cocoma</Link>
                  </li>
                  <li className="my-2">
                    <Link to={"/blog"}>Blogs</Link>
                  </li>
                </ul>
              </div>

              <div className="footer-menu-item large-screen-lang-select">
                <SelectLang />
              </div>

              {/* <div className="col-lg-3 col-sm-6 com-md-3">
             <ul>
                <li>
                  <h4>Company</h4>
                </li>
                <li>Media kit</li>
                <li>Cocoma for good</li>
                <li>Press</li>
                <li>Customer Stories</li>
              </ul> 
            </div> */}
              {/* <div className="col-lg-3 col-sm-6 col-md-3"></div> */}

              {/* <div className="col-lg-3 col-sm-6 col-md-3">
             <ul>
                <li>
                  <h4>Expertise</h4>
                </li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul> 
            </div> */}
              {/* <div className="col-lg-3 col-sm-6 col-md-3 ">
              <ul>
                <li>
                  <h4>Help</h4>
                </li>
                <li>
                  <a href={"/contact-us"}>Contact us</a>
                </li>
                <li>FAQs</li>
                <li>Help Centre</li>
                <li>terms & conditions</li>
                <li>Cookie Setting</li>
              </ul>
            </div> */}
              {/* <div className="col-lg-3 col-sm-6 col-md-3">
             <ul>
                <li>
                  <h4>resources</h4>
                </li>
                <li>Affiliates</li>
                <li>Partners</li>
                <li>Learning Centre</li>
              </ul>
            </div> */}
            </div>
          </div>

          <div className="footer-Copyright-wrapper">
            <h5>
              Copyright @ All rights reserved to Cocoma Digital Private Limited
            </h5>
          </div>
        </div>
      </div>
    </>
  );
}
