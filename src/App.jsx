import { useEffect, Suspense, lazy } from "react";
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
import { fetchServices } from "./Service/redux/serviceSlice";
import { fetchCommonApiWithCache } from "./Service/redux/commonApiSlice";

// Performance monitoring imports
import performanceMonitor from './utils/performanceMonitor';
import resourcePreloader from './utils/resourcePreloader';
import lcpMonitor from './utils/lcpMonitor';

// Critical components loaded immediately (above the fold)
import Header from "./components/header/header";
import CocomaFooter from "./components/Footer/CocomaFooter";
import ScrollToTop from "./components/scrollToTop";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import { PageLoader } from "./components/common/Skeleton/Skeleton";

// Lazy load all route components for code splitting
const Home = lazy(() => import("./Pages/Home/Home"));
const Services = lazy(() => import("./Pages/Service/Services"));
const SingleService = lazy(() => import("./Pages/Services/SingleService"));
const AboutUs = lazy(() => import("./Pages/About/about"));
const CreativeHouse = lazy(() => import("./Pages/CreativeHouse/CreativeHouse"));
const SingleVideo = lazy(() => import("./Pages/SingleVideo/SingleVideo"));
const AllWebSeriesPortfolio = lazy(() => import("./Pages/AllWebSeries/AllWebSeriesPortfolio"));
const WebSeriesIndividual = lazy(() => import("./Pages/AllWebSeries/WebSeriesIndividual"));
const ViewAllSeries = lazy(() => import("./Pages/AllWebSeries/ViewAllSeries"));
const Blog = lazy(() => import("./Pages/Blog/Blog"));
const BlogDetails = lazy(() => import("./Pages/BlogDetails/BlogDetails"));
const Solution = lazy(() => import("./Pages/Solution/Solution"));
const AddToCart = lazy(() => import("./Pages/cart/AddToCart"));
const ContactUs = lazy(() => import("./Pages/contactUs/ContactUs"));
const Career = lazy(() => import("./Pages/Jobs/Career/Career"));
const JobDetails = lazy(() => import("./Pages/Jobs/JobDetails"));
const JobApplicationForm = lazy(() => import("./Pages/Jobs/JobApplication"));
const ThankYouPage = lazy(() => import("./Pages/Jobs/FormSubmitSuccess"));
const ScheduleMeeting = lazy(() => import("./Pages/Sedulemeating/ScheduleMeeting"));
const ScheduleMeetingDetails = lazy(() => import("./Pages/Sedulemeating/ScheduleMeetingDetail"));
const ClientPage = lazy(() => import("./Pages/SucessStories/clientSucess"));
const Login = lazy(() => import("./Pages/Login/Login"));
const SuccessStoryViewAll = lazy(() => import("./Pages/SuccessStoryViewAll/SuccessStoryViewAll"));
const NotFound = lazy(() => import("./Pages/PageNotFound"));

function App() {
  const dispatch = useDispatch();

  // SET DATA WITH USE STATE
  const { service_category = [] } = useSelector((state) => state?.commonApi?.commonApi?.data || {});

  // Initialize performance monitoring
  useEffect(() => {
    console.log('🚀 Performance monitoring initialized');
    
    // Initialize LCP Monitor
    lcpMonitor.init();
    
    // Listen for performance metrics
    const handlePerformanceMetric = (event) => {
      const { name, data } = event.detail;
      
      // Log critical metrics in development
      if (process.env.NODE_ENV === 'development') {
        if (['LCP', 'FID', 'CLS'].includes(name)) {
          console.log(`📊 Core Web Vital - ${name}:`, data);
        }
      }
      
      // You can send metrics to analytics here
      // Example: sendToAnalytics(name, data);
    };
    
    window.addEventListener('performance-metric', handlePerformanceMetric);
    
    // Performance debugging in development
    if (process.env.NODE_ENV === 'development') {
      // Add performance summary to window for debugging
      window.getPerformanceSummary = () => performanceMonitor.getSummary();
      window.getResourcePreloaderStats = () => resourcePreloader.getStats();
      window.getLCPMetrics = () => window.__LCPMonitor__?.getMetrics();
      
      // Log performance summary after 5 seconds
      setTimeout(() => {
        console.log('📊 Performance Summary:', performanceMonitor.getSummary());
        console.log('🔄 Resource Preloader Stats:', resourcePreloader.getStats());
        console.log('📈 LCP Metrics:', window.__LCPMonitor__?.getMetrics());
      }, 5000);
    }
    
    return () => {
      window.removeEventListener('performance-metric', handlePerformanceMetric);
    };
  }, []);

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
        <ErrorBoundary>
          <Suspense fallback={<PageLoader message="Loading page..." />}>
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
          </Suspense>
        </ErrorBoundary>
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