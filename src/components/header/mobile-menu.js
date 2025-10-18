<Navbar
  className="header-top-nav custom-navbar"
  expand="lg"
  expanded={expanded} // Control collapse state
>
  <Container fluid>
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
        className="logo-name d-none d-lg-inline" // Show name only on large screens
      />
    </Navbar.Brand>

    {/* Right-Side Buttons and Toggle */}
    <div className="d-flex align-items-center ms-auto">
      {/* Language Button (Mobile and Tablet) */}
      <div className="me-2 d-lg-none btn-language">
        <LangOverlay />
      </div>
      {/* Mobile Menu Toggle */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNavbar}>
        <RiMenuFill size={24} />
      </Navbar.Toggle>
    </div>

    {/* Menu Items */}
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="menu-items">
        <Nav.Link href="/">Home</Nav.Link>

        {/* Our Services Dropdown */}
        <div
          title="Our Services"
          id="services-dropdown"
          className="custom-nav-dropdown"
        >
          {isMobile() ? (
            <div>
              {categories.map((category, index) => (
                <div key={index}>
                  {/* Render Categories */}
                  <div
                    className={`dropdown-category ${
                      activeCategory === category ? "active" : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </div>

                  {/* Render Subcategories if Category is Active */}
                  {activeCategory === category && (
                    <div className="subcategory-container-mobile">
                      {services[category]?.map((subcategory, subIndex) => (
                        <div key={subIndex} className="subcategory-card">
                          <strong>{subcategory.name}</strong>
                          <p>{subcategory.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="dropdown-container">
              {/* Left Column: Categories */}
              <div className="dropdown-left">
                <div className="p-2">
                  <h2>By Platform</h2>
                </div>
                <div className="d-flex mb-2 justify-content-around">
                  <div className="headder-logo-bg">
                    <img src={youtube} alt="" />
                  </div>
                  <div className="headder-logo-bg">
                    <img src={instagram} alt="" />
                  </div>
                  <div className="headder-logo-bg">
                    <img src={facebook} alt="" />
                  </div>

                  <div className="headder-logo-bg">
                    <img src={twitter} alt="" />
                  </div>
                  <div className="headder-logo-bg">
                    <img src={tiktok} alt="" />
                  </div>
                  <div className="headder-logo-bg">
                    <img src={linkedin} alt="" />
                  </div>
                </div>
                <div style={{ paddingLeft: 10, paddingTop: 10 }}>
                  <h4>our services by skills</h4>
                </div>
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className={`dropdown-category ${
                      activeCategory === category ? "active" : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>

              {/* Right Column: Services */}
              <div className="dropdown-right p-3">
                <h3>{activeCategory}</h3>
                <div className="services-headder-grid mt-2">
                  {services[activeCategory]?.map((service, index) => (
                    <div key={index} className="services-headder-Item">
                      <img
                        src={service.icon}
                        alt={service.name}
                        className="service-icon"
                      />
                      <div>
                        <strong>{service.name}</strong>
                        <p>{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Other Dropdowns */}
        <NavDropdown
          title="Our Expertise"
          className="custom-nav-dropdown-our-Expertise"
          id="expertise-dropdown"
        >
          <div className="expertise-dropdown">
            {/* Categories */}
            <div className="expertise-categories">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`expertise-category ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <span>{category}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="view-all-btn">View All Events</div>
          </div>
        </NavDropdown>

        <NavDropdown title="Solution" id="solution-dropdown">
          <div className="expertise-dropdown">
            {/* Categories */}
            <div className="expertise-categories">
              {solution.map((solution, index) => (
                <div
                  key={index}
                  className={`expertise-category ${
                    activeCategory === solution ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(solution)}
                >
                  <span>{solution}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="view-all-btn">View All Events</div>
          </div>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>

    {/* Get Started Button and Language (Desktop Only) */}
    <div className="d-none d-lg-flex align-items-center">
      <LangOverlay />
      <Button variant="warning" className="btn-get-started">
        Get Started Today <HiArrowUpRight size={20} />
      </Button>
    </div>
  </Container>
</Navbar>;
