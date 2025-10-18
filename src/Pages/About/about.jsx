import React, { useState } from "react";
import ReactPlayer from "react-player";
import Modal from "react-modal";
import "./about.css";
import LifeAtCocoma from "../../components/AboutUs/LifeAtCocoma";
import SocialWorkSlider from "../../components/AboutUs/SocialWork";
import Timeline from "../../components/AboutUs/timeline";
import BusinessCareerSection from "../../components/Home/section14/section14";
import PlayBtn from "../../components/common/PlayBtn/PlayBtn";
import OurStoryMission from "./our-story-mission";

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const OurStoryMissionData = [
    {
      title: "Our Story",
      description:
        "Cocoma Digital was founded with a clear mission: to help businesses and creators harness the full potential of digital platforms, particularly YouTube. What started as a personal endeavor to help a friend grew into a full-scale digital marketing powerhouse. Over the years, our expertise expanded from content creation to mastering the intricacies of YouTube growth hacking and post-production. Today, Cocoma Digital stands at the forefront of digital transformation, partnering with major brands and entertainment giants to create compelling content that drives engagement, conversions, and growth.",
      images: [
        { id: 1, url: "../../Images/about/aboutStory.png" },
        { id: 2, url: "../../Images/about/aboutStory.png" },
        { id: 3, url: "../../Images/about/aboutStory.png" },
        { id: 4, url: "../../Images/about/aboutStory.png" },
        { id: 5, url: "../../Images/about/aboutStory.png" },
        { id: 6, url: "../../Images/about/aboutStory.png" },
        { id: 7, url: "../../Images/about/aboutStory.png" },
        { id: 8, url: "../../Images/about/aboutStory.png" },
      ],
    },
    {
      title: "Our Mission",
      description:
        "Our mission is simple: To be the catalyst for transformation in the digital world. By delivering top-tier content, data-driven strategies, and unparalleled performance, we aim to empower businesses and individuals to realize their potential and thrive in an ever-evolving digital landscape. At Cocoma Digital, we don’t just provide services; we create opportunities, mentor talent, and build lasting relationships.",
      images: [
        { id: 1, url: "../../Images/about/aboutStory.png" },
        { id: 2, url: "../../Images/about/aboutStory.png" },
        { id: 3, url: "../../Images/about/aboutStory.png" },
        { id: 4, url: "../../Images/about/aboutStory.png" },
        { id: 5, url: "../../Images/about/aboutStory.png" },
        { id: 6, url: "../../Images/about/aboutStory.png" },
        { id: 7, url: "../../Images/about/aboutStory.png" },
        { id: 8, url: "../../Images/about/aboutStory.png" },
      ],
    },
  ];

  return (
    <>
      <div className="my-md-5 my-3">
        {/* About Us Content */}
        <div className="about-us-first-section-wrapper">
          <div className="about-us-first-section">
            <div className="about-us-first-section-image-wrapper">
              <img
                src="../../Images/about/aboutmainimg.svg"
                alt="Person"
                className="about-image img-fluid"
              />
            </div>

            {/* Text Section */}
            <div className="about-us-first-section-content-wrapper">
              <h2 className="">About Us</h2>
              <p className="about-us-first-section-content-description">
                Cocoma Digital is a leading digital marketing and content
                creation company, specializing in YouTube growth hacking and
                post-production services. With a deep understanding of the
                digital landscape, we help businesses and brands achieve their
                full potential by creating engaging content, developing tailored
                strategies, and driving performance across multiple platforms.
                Our team of passionate creators and experts is dedicated to
                transforming brands and empowering individuals through
                innovative digital solutions.
              </p>
            </div>
          </div>
        </div>

        {/* second section video card */}
        <div className="mt-5 w-100 about-us-second-section">
          <div className="position-relative">
            <img
              src="../../Images/about/videothumbanil.svg"
              alt="Team Video"
              className="img-fluid rounded"
            />
            <button
              className="play-button position-absolute"
              onClick={openModal}
            >
              <PlayBtn />
            </button>
          </div>
        </div>

        {/* third & fourth story & mission section content & card slider*/}
        {OurStoryMissionData?.map((data, index) => {
          return <OurStoryMission key={index} data={data} />;
        })}

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Video Modal"
            className="video-modal"
            overlayClassName="video-modal-overlay"
          >
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <ReactPlayer
              url="https://www.w3schools.com/html/mov_bbb.mp4"
              playing
              controls
              width="100%"
            />
          </Modal>
        )}
      </div>
      <Timeline />
      <LifeAtCocoma />
      <SocialWorkSlider />
      <BusinessCareerSection />
    </>
  );
};

export default AboutUs;
