import { useEffect, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { RiMenuFill } from "react-icons/ri";
import "./Header.css";
import { IoIosArrowForward } from "react-icons/io";
import "./Language.css";
import { Link, useLocation } from "react-router-dom";
import SecondaryLink from "../common/SecondaryLink/SecondaryLink";
import { HiArrowUpRight } from "react-icons/hi2";
import { clearUser } from "../../Service/redux/meSlice";
import { useDispatch, useSelector } from "react-redux";
import adminServiceInstance from "../../Service/apiService";

function Header() {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isMobile = () => window.innerWidth <= 768;
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const user = useSelector((state) => state?.me?.user);
  const service = useSelector((state) => state?.service?.services?.data);
  const location = useLocation();
  const currentPath = location.pathname;
  const [serviceData, setServiceData] = useState(service);
  const { service_category = [], other_service = [] } = useSelector((state) => state?.commonApi?.commonApi?.data || {});

  const filteredServicesCategory = useMemo(() => {
    return (
      service_category?.filter(
        (category) => category?.category_name !== "Service Platform"
      ) || []
    );
  }, [service_category]);

  useEffect(() => {
    if (filteredServicesCategory.length) {
      setActiveCategory(filteredServicesCategory[0].category_name);
      setActiveCategoryId(filteredServicesCategory[0].id);
    }
  }, [filteredServicesCategory]);

  // Fetch Services data on category change
  const fetchServiceData = async (id) => {
    try {
      const params = {
        category_id: id,
        limit: 6,
        offset: 0
      };
      const response = await adminServiceInstance?.Services(params);
      setServiceData(response?.data?.data);
    } catch (err) {
      console.log(err.message || "Something went wrong");
    }
  };

  const toggleNavbar = () => {
    setExpanded((prev) => !prev);
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    fetchServiceData(categoryId)
    setActiveCategoryId(categoryId);
    setActiveCategory(categoryName);
  };

  const logoutHandler = () => {
    dispatch(clearUser());
    localStorage.removeItem("user");
  }

  return (
    <>
      <div className="hide-div"></div>
      <div className="header-main-wraper">
        <Navbar
          className="header-top-nav custom-navbar"
          expand="lg"
          expanded={expanded}
        >
          <Container fluid className="pt-2 pb-2">
            {/* Logo Section */}
            <Navbar.Brand href="/" className="d-flex align-items-center">
              <img
                src="../../Images/app_logo.svg"
                alt="app logo"
                className="logo-image"
              />
              <img
                src="../../Images/app_name.svg"
                alt="app name"
                className="logo-name d-none d-lg-inline"
              />
            </Navbar.Brand>

            {/* Right-Side Buttons and Toggle */}
            <div className="d-flex align-items-center ms-auto">
              {/* Language Button (Mobile and Tablet) */}
              {/* <div className="me-2 d-lg-none btn-language">
                <LangOverlay />
              </div> */}
              {user === "admin" &&
                <button
                  style={{ marginRight: "10px" }}
                  className="logout-text d-lg-none d-block"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              }
              {currentPath?.startsWith("/client-success-stories") && (
                <div className="d-lg-none d-block">
                  <Link to="/ScheduleMeeting" className="header-book-call-btn">
                    <span>Book A Call</span>
                    <HiArrowUpRight
                      style={{
                        color: "#000",
                        fontWeight: "bold",
                        strokeWidth: 1,
                      }}
                    />
                  </Link>
                </div>
              )}
              {/* Mobile Menu Toggle */}
              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                onClick={toggleNavbar}
              >
                <RiMenuFill size={24} />
              </Navbar.Toggle>
            </div>
            {/* Menu Items */}
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="menu-items">
                <Nav.Link
                  href="/"
                  className={`custom-nav-dropdown for-new-pos ${currentPath === "/" ? "active-home" : ""
                    }`}
                >
                  Home
                </Nav.Link>

                {/* Our Services Dropdown */}
                <NavDropdown
                  title="Our Services"
                  id="services-dropdown"
                  show={dropdownOpen}
                  onToggle={() => setDropdownOpen((prev) => !prev)}
                  className="custom-nav-dropdown for-new-pos"
                >
                  {isMobile() ? (service_category &&
                    <div>
                      {service_category?.map((category) => (
                        <div key={category?.id}>
                          {/* Render Categories */}
                          <div
                            className={`dropdown-category ${activeCategoryId === category?.id ? "active" : ""
                              }`}
                            onClick={() => handleCategoryClick(category?.id, category?.category_name)}
                          >
                            {category?.category_name}
                          </div>
                          {activeCategoryId === category?.id &&
                            <div className="subcategory-container-mobile">
                              {serviceData?.map((service, index) => (
                                <div key={index} className="subcategory-card">
                                  <Link
                                    to={`/services/${service?.slug}`}
                                    className="d-block"
                                    onClick={() => {
                                      setDropdownOpen(false);
                                      setExpanded(false);
                                    }}
                                  >
                                    <div className="w-100 d-flex ">
                                      <img
                                        src={service?.image}
                                        alt={service?.title}
                                        className="mobile-service-render-image"
                                      />
                                      <div>
                                        <strong>{service?.title}</strong>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="dropdown-container">
                      {/* Left Column: Categories */}
                      <div className="dropdown-left">
                        <div className="p-2 px-3 py-4">
                          <h2>By Platform</h2>
                        </div>
                        {other_service?.length &&
                          <div className="d-flex mb-2 justify-content-around ">
                            {other_service?.map(
                              (service) => (
                                <div
                                  className="headder-logo-bg"
                                  key={service?.id}
                                >
                                  <Link
                                    to={`/services/${service?.slug}`}
                                    onClick={() => setDropdownOpen(false)}
                                  >
                                    <img
                                      src={service?.image}
                                      alt="icon"
                                    />
                                  </Link>
                                </div>
                              )
                            )}
                          </div>}
                        <div
                          style={{
                            paddingLeft: 10,
                            paddingTop: 10,
                            textTransform: "capitalize",
                          }}
                        >
                          <h4>our services by skills</h4>
                        </div>
                        {filteredServicesCategory?.map((category) => (
                          <div
                            key={category?.id}
                            className={`dropdown-category ${activeCategoryId === category?.id ? "active" : ""
                              }`}
                            onClick={() => handleCategoryClick(category?.id, category?.category_name)}
                          >
                            {category?.category_name}
                            <IoIosArrowForward size={25} />
                          </div>
                        ))}
                      </div>
                      <div className="dropdown-right p-3">
                        <div className="dropdown-right-cat-heading">
                          {activeCategory}
                        </div>

                        <div className="services-header-grid mt-2">
                          {serviceData?.map(
                            (service, index) => (
                              <div key={index} className="services-header-item">
                                <Link
                                  to={`/services/${service?.slug}`}
                                  className="d-flex"
                                  onClick={() => setDropdownOpen(false)}
                                >
                                  <img
                                    src={service?.image}
                                    alt={service?.title}
                                    className="service-icon"
                                  />
                                  <div className="px-3">
                                    <strong>{service?.title}</strong>
                                  </div>
                                </Link>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </NavDropdown>

                {/* Our Work Dropdown */}
                <NavDropdown title="Our work" id="work-dropdown" className="our-work-custom-nav-dropdown">
                  <NavDropdown.Item href="/view-all-series">
                    Marketing
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/creative-house/">
                    Creative
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item href="#action2">
                    Development
                  </NavDropdown.Item> */}
                </NavDropdown>

              </Nav>
            </Navbar.Collapse>
            {/* Get Started Button and Language (Desktop Only) */}
            <div className="d-none d-lg-flex align-items-center">
              <SecondaryLink title={"Get Started Today"} path="contact-us" />
              {user === "admin" && <button
                className="logout-text"
                onClick={logoutHandler}
              >
                Logout
              </button>}
            </div>
          </Container>
        </Navbar>
      </div>
    </>
  );
}

export default Header;
