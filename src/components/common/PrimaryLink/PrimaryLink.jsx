import React from 'react'
import "./PrimaryLink.css";
import { Link } from 'react-router-dom';

const PrimaryLink = ({path}) => {
  return (
    <>
      <Link 
       className="home-services-show-more-btn"
       to={path}
      >
        View All
      <img src="/Images/home/dropdown-arrow.svg" alt="down arrow icon" />
      </Link>
    </>
  )
}

export default PrimaryLink