import { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./Service/redux/meSlice";

import Header from "./components/header/header";
import CocomaFooter from "./components/Footer/CocomaFooter";
import ScrollToTop from "./components/scrollToTop";

import Services from "./Pages/Service/Services";
import AddToCart from "./Pages/cart/AddToCart";
import ContactUs from "./Pages/contactUs/ContactUs";
import Career from "./Pages/Jobs/Career/Career";
import JobDetails from "./Pages/Jobs/JobDetails";
import JobApplicationForm from "./Pages/Jobs/JobApplication";
import ThankYouPage from "./Pages/Jobs/FormSubmitSuccess";

import SingleService from "./Pages/Services/SingleService";
import AboutUs from "./Pages/About/about";
import CreativeHouse from "./Pages/CreativeHouse/CreativeHouse";
import SingleVideo from "./Pages/SingleVideo/SingleVideo";
import AllWebSeriesPortfolio from "./Pages/AllWebSeries/AllWebSeriesPortfolio";
import WebSeriesIndividual from "./Pages/AllWebSeries/WebSeriesIndividual";
import ViewAllSeries from "./Pages/AllWebSeries/ViewAllSeries";

import NotFound from "./Pages/PageNotFound";
import ScheduleMeeting from "./Pages/Sedulemeating/ScheduleMeeting";
import ScheduleMeetingDetails from "./Pages/Sedulemeating/ScheduleMeetingDetail";
import ClientPage from "./Pages/SucessStories/clientSucess";
import Blog from "./Pages/Blog/Blog";
import Solution from "./Pages/Solution/Solution";
import BlogDetails from "./Pages/BlogDetails/BlogDetails";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import SuccessStoryViewAll from "./Pages/SuccessStoryViewAll/SuccessStoryViewAll";
import { fetchServices } from "./Service/redux/serviceSlice";
import { fetchCommonApiWithCache } from "./Service/redux/commonApiSlice";

function App() {
  const dispatch = useDispatch();

  // SET DATA WITH USE STATE
  const { service_category = [] } = useSelector((state) => state?.commonApi?.commonApi?.data || {});

  // check user is admin and set in redux
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(setUser(user));
    }
  }, [dispatch]);


  useEffect(() => {
    dispatch(fetchCommonApiWithCache());
  }, [dispatch]);

  // fetch service data initially
  useEffect(() => {
    if (service_category?.length > 0) {
      const params = {
        category_id: service_category[0]?.id,
      };
      dispatch(fetchServices(params));
    }
  }, [dispatch, service_category]);

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Scroll to top on navigation */}
      <ScrollToTop />

      {/* Static Header */}
      <Header />

      <main>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Services */}
          <Route path="/services/:slug" element={<Services />} />
          <Route path="/service-details/:slug" element={<SingleService />} />

          {/* Creative House */}
          <Route path="/creative-house/:slug?" element={<CreativeHouse />} />
          <Route path="/single-video/:slug" element={<SingleVideo />} />

          {/* Success Stories / Web Series */}
          <Route path="/success-story-view-all" element={<SuccessStoryViewAll />} />
          <Route path="/view-all-series" element={<ViewAllSeries />} />
          <Route path="/web-series-individual/:slug" element={<WebSeriesIndividual />} />
          <Route path="/All-web-series-portfolio" element={<AllWebSeriesPortfolio />} />

          {/* Blog */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog-details/:slug" element={<BlogDetails />} />

          {/* Other Pages */}
          <Route path="/solution" element={<Solution />} />
          <Route path="/cart" element={<AddToCart />} />
          <Route path="/client-success-stories/:slug" element={<ClientPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/career" element={<Career />} />
          <Route path="/job-details/:slug" element={<JobDetails />} />
          <Route path="/job-application/:slug" element={<JobApplicationForm />} />
          <Route path="/thank-you" element={<ThankYouPage />} />

          {/* Meetings */}
          <Route path="/schedule-meeting" element={<ScheduleMeetingDetails />} />
          <Route path="/ScheduleMeeting" element={<ScheduleMeeting />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Static Footer */}
      <CocomaFooter />
    </>


  );
}


function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;