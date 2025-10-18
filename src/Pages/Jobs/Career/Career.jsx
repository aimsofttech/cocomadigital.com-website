import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Career.css";
import { TbSearch } from "react-icons/tb";
import { Link } from "react-router-dom";
import { HiArrowNarrowRight } from "react-icons/hi";
import CustomSelect from "../../../components/common/CustomSelect/CustomSelect";
import AdminService from "../../../Service/apiService";
import Pagination from "../../../components/common/Pagination/Pagination";
import { ADMIN_URL, jobTypeData } from "../../../utils";
import EditLink from "../../../components/Edit-Link/Edit-Link";

// Career Component
const Career = () => {
  const topScrollToCards = useRef(null);
  const [jobs, setJobs] = useState([]);
  // const [allLocation, setAllLocation] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [resetFilters, setResetFilters] = useState(false);
  const [jobList, setJobList] = useState([]);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    all: "All",
    job_type: "",
    workplace_type: "",
    job_experience: "",
    job_location: "",
    limit: 30,
  });
  const totalPages = Math.ceil(totalDataCount / filters?.limit);
  const offset = (currentPage - 1) * filters?.limit;

  // scroll to top to cards on page change
  const scrollToTopToCards = () => {
    topScrollToCards.current?.scrollIntoView({ behavior: "smooth" });
  };

  // -----Handle Data on search-----------
  const textSearchHandler = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  // -----get api for job list--------
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoadingJobs(true);
        const response = await AdminService?.getCareerJobData({
          job_experience: filters?.job_experience,
          job_type: filters?.job_type,
          workplace_type: filters?.workplace_type,
          job_title: searchText,
          job_location: filters?.job_location,
          limit: filters?.limit,
          offset: offset,
        });
        setJobList(response?.data?.data?.job_list);
        if (
          searchText ||
          filters?.job_experience ||
          filters?.job_location ||
          filters?.job_type ||
          filters?.workplace_type
        ) {
          setTotalDataCount(response?.data?.data?.job_list?.length);
        } else {
          setTotalDataCount(response?.data?.data?.total_count);
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobData();
  }, [filters, searchText, offset]);

  // useEffect(() => {
  //   const uniqueLocations = Array.from(
  //     new Set(jobList?.map((item) => item?.job_location))
  //   ).map((location) => ({
  //     title: location,
  //     slug: location,
  //   }));
  //   setAllLocation(uniqueLocations);
  // }, [jobList]);

  useEffect(() => {
    if (
      filters.job_type ||
      filters.workplace_type ||
      filters.job_location ||
      filters.job_experience
    ) {
      const filteredJobs = jobs.filter((job) => {
        return (
          (filters.job_type === "" || job.job_type === filters.job_type) &&
          (filters.workplace_type === "" ||
            job.workplace_type === filters.workplace_type) &&
          (filters.job_location === "" ||
            job.job_location === filters.job_location) &&
          (filters.job_experience === "" ||
            job.job_experience === Number(filters.job_experience))
        );
      });
      setJobs(filteredJobs);
    }
  }, [filters, jobs]);

  // const jobTypeData = {
  //   full_time: "Full Time",
  //   part_time: "Part Time",
  //   freelance: "Freelance",
  //   internship: "Internship",
  //   contract: "Contract",
  // };

  const workTypeData = {
    on_site: "On-Site",
    remote: "Remote",
    hybrid: "Hybrid",
  };

  const categories = [
    {
      id: 1,
      category: "All",
      subCategory: null,
    },
    {
      id: 2,
      category: "Job Type",
      category_slug: "job_type",
      subCategory: [
        { title: "Full Time", slug: "full_time" },
        { title: "Part Time", slug: "part_time" },
        { title: "Freelance", slug: "freelance" },
        { title: "Internship", slug: "internship" },
        { title: "Contract", slug: "contract" },
      ],
    },
    {
      id: 3,
      category: "Work Type",
      category_slug: "workplace_type",
      subCategory: [
        { title: "On-Site", slug: "on_site" },
        { title: "Remote", slug: "remote" },
        { title: "Hybrid", slug: "hybrid" },
      ],
    },
    {
      id: 4,
      category: "Experience Level",
      category_slug: "job_experience",
      subCategory: Array.from({ length: 21 }, (_, i) => ({
        title: i === 0 ? "Fresher" : `${i} Year`,
        slug: i,
      })),
    },
    // {
    //   id: 5,
    //   category: "Location",
    //   category_slug: "job_location",
    //   subCategory: allLocation,
    // },
  ];

  // Handle category filter
  const handleCategorySelect = (category, subCategory) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      all: "",
      [category]: subCategory,
    }));
    setResetFilters(false);
  };

  const categoryAllClear = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      all: "All",
      job_type: "",
      workplace_type: "",
      job_experience: "",
      job_location: "",
    }));
    setCurrentPage(1);
    setResetFilters(true);
  };

  const JobCard = ({ title, experience, type, workplace, id, slug, location }) => {
    return (
      <div className="career-page-card-main p-3 shadow-sm w-100 position-relative">
        <h5 className="career-page-card-title">{title}</h5>
        <div className="career-page-card-item-main-wraper">
          <div className="career-page-card-item-wraper">
            <div className="career-page-card-item-icon-text-wraper">
              <img src="/Images/career/profile-icon.svg" alt="carrer-icon" />
              <p>{experience === 0 ? "Fresher" : `+${experience} Years`}</p>
            </div>
            <div className="career-page-card-item-icon-text-wraper">
              <img src="/Images/career/job-type-icon.svg" alt="carrer-icon" />
              <p>{jobTypeData[type]}</p>
            </div>
          </div>
          <div className="career-page-card-item-wraper">
            <div className="career-page-card-item-icon-text-wraper">
              <img src="/Images/career/work-type-icon.svg" alt="carrer-icon" />
              <p> {workTypeData[workplace]}</p>
            </div>
            <div className="career-page-card-item-icon-text-wraper">
              <img src="/Images/career/location-icon.svg" alt="carrer-icon" />
              <p>{location}</p>
            </div>
          </div>
        </div>
        <div className="career-page-card-read-more-btn-wraper">
          <Link
            className="career-page-card-read-more-btn"
            to={`/job-details/${slug}`}
          >
            Read More
            {/* <img src="/Images/career/right-arrow-icon.svg" alt="right-arrow-icon" /> */}
            <HiArrowNarrowRight className="career-page-card-read-more-btn-icon" />
          </Link>
        </div>
        <div className="position-absolute top-0 end-0 me-2 mt-1">
        <EditLink
           path={`${ADMIN_URL}/job_list/show/${id}`} 
        />
        </div>
      </div>
    );
  };

  return (
    <div ref={topScrollToCards} className="career-page-main-wraper">
      <div className="career-page-main py-sm-5 py-4">
        <h2 className="text-center fw-bold mb-sm-1 mb-0">Job Career</h2>
        <div className="career-page-content-wraper">
          {/* search content */}
          <div className="career-page-search-wraper mb-sm-3">
            <input
              onChange={textSearchHandler}
              type="text"
              placeholder="Search..."
            />
            <TbSearch className="career-page-search-icon" />
          </div>
          {/* Category Buttons */}
          <div className="career-page-btn-wraper">
            {categories?.map((category, index) =>
              category?.category === "All" ? (
                <button
                  onClick={categoryAllClear}
                  className={`career-page-btn ${
                    filters?.all === "All" ? "active-dropdown" : ""
                  }`}
                  key={index}
                >
                  {category?.category}
                </button>
              ) : (
                <CustomSelect
                  key={index}
                  category={category}
                  reset={resetFilters}
                  filter={filters}
                  onSelect={handleCategorySelect}
                />
              )
            )}
          </div>

          {/* Job Listings */}
          <div className="career-page-card-main-wraper">
            {loadingJobs && (
              <div className="career-page-no-data-wraper">
                <p className="text-center">Loading...</p>
              </div>
            )}
            {!loadingJobs &&
              (jobList?.length > 0 ? (
                jobList?.map((job, index) => (
                  <JobCard
                    key={index}
                    title={job?.job_title}
                    experience={job?.job_experience}
                    type={job?.job_type}
                    workplace={job?.workplace_type}
                    id={job?.id}
                    slug={job?.job_slug}
                    location={job?.job_location}
                  />
                ))
              ) : (
                <div className="career-page-no-data-wraper">
                  <p className="text-center">No jobs available</p>
                </div>
              ))}
          </div>
          {totalDataCount > 6 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              scrollToTopToCards={scrollToTopToCards}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Career;
