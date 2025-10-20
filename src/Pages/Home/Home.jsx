import { useEffect, useState, Suspense, lazy } from "react";
import "./Home.css";
import { useSelector } from "react-redux";
import adminServiceInstance from "../../Service/apiService";
import { SkeletonHeroBanner, SkeletonServicesGrid, SkeletonCard } from "../../components/common/Skeleton/Skeleton";

// Critical above-the-fold components loaded immediately
import Section01 from "../../components/Home/Section01/section01";
import Section02 from "../../components/Home/section02";

// Lazy load below-the-fold components
const ExploreOurServices = lazy(() => import("../../components/Home/ExploreServices/services"));
const Section04 = lazy(() => import("../../components/Home/Section04/section04"));
const Section05 = lazy(() => import("../../components/Home/Section05/section05"));
const Section06 = lazy(() => import("../../components/Home/Section06/section06"));
const Section07 = lazy(() => import("../../components/Home/Section07/section07"));
const Section08 = lazy(() => import("../../components/Home/Section08/section08"));
const Section09 = lazy(() => import("../../components/Home/Section09/Section09"));
const Section12 = lazy(() => import("../../components/Home/Section12/section12"));
const BusinessCareerSection = lazy(() => import("../../components/Home/section14/section14"));

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [homeData, setHomeData] = useState({});
  const [allCategories, setAllCategories] = useState({});
  const [error, setError] = useState("");
  const language = useSelector((state) => state?.lang?.lang);

  // OPTIMIZATION: Fetch critical home data immediately (needed for above-fold content)
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Check cache first to avoid redundant API calls
        const cacheKey = `homeData_${language}`;
        const cached = sessionStorage.getItem(cacheKey);
        const cacheTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);
        const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;

        // Use cache if less than 5 minutes old
        if (cached && cacheAge < 5 * 60 * 1000) {
          console.log('📦 Using cached home data');
          setHomeData(JSON.parse(cached));
          return;
        }

        console.log('🌐 Fetching fresh home data');
        const response = await adminServiceInstance?.Home(language);
        const data = response?.data?.data;
        setHomeData(data);

        // Cache the response
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
      } catch (err) {
        console.error("API Error:", err);
        setError(err?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, [language]);

  // OPTIMIZATION: Defer categories API call - only needed for below-fold sections
  // This reduces TBT by not blocking main thread with non-critical API calls
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        // Check cache first
        const cacheKey = `categories_${language}`;
        const cached = sessionStorage.getItem(cacheKey);
        const cacheTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);
        const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;

        // Use cache if less than 5 minutes old
        if (cached && cacheAge < 5 * 60 * 1000) {
          console.log('📦 Using cached categories data');
          setAllCategories(JSON.parse(cached));
          return;
        }

        console.log('🌐 Fetching fresh categories data');
        const response = await adminServiceInstance?.homeAllCategories();
        const data = response?.data?.data;
        setAllCategories(data);

        // Cache the response
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
      } catch (err) {
        console.error("Categories API Error:", err);
        setError(err?.message || "Something went wrong");
      }
    };

    // Defer this call using requestIdleCallback to avoid blocking main thread
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => fetchAllCategories(), { timeout: 2000 });
    } else {
      // Fallback: wait 1 second before fetching
      setTimeout(fetchAllCategories, 1000);
    }
  }, [language]);
  

  if (isLoading) {
    return (
      <div className="home-main-wraper">
        <SkeletonHeroBanner />
        <SkeletonServicesGrid count={6} />
        <SkeletonCard count={4} />
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">Error: {error}</p>;
  }

  return (
    <>
      <div className="home-main-wraper">
        <div className="home-main">
          {/* Critical above-the-fold content loads immediately */}
          {homeData?.top_banner && <Section01 bannerData={homeData?.top_banner} />}
          <Section02/>
          
          {/* Below-the-fold content loads lazily when in view */}
          <Suspense fallback={<SkeletonServicesGrid count={6} />}>
            <ExploreOurServices />
          </Suspense>
          
          {homeData?.other_service && (
            <Suspense fallback={<SkeletonCard count={3} />}>
              <Section04 ServicesToShow={homeData?.other_service} />
            </Suspense>
          )}
          
          {homeData?.video && (
            <Suspense fallback={<SkeletonCard count={1} />}>
              <Section05 VideoData={homeData?.video} />
            </Suspense>
          )}
          
          <Suspense fallback={<SkeletonCard count={2} />}>
            <Section06 />
          </Suspense>
          
          {homeData?.client && (
            <Suspense fallback={<SkeletonCard count={4} />}>
              <Section07 ClientData={homeData?.client} />
            </Suspense>
          )}

          <Suspense fallback={<SkeletonCard count={3} />}>
            <Section08 marketingHouseCategory={allCategories?.marketing_house_category} />
          </Suspense>
          
          <Suspense fallback={<SkeletonCard count={3} />}>
            <Section09 creativeHouseCategory={allCategories?.creative_house_category} />
          </Suspense>

          {homeData?.top_banner?.book_call_template_id && (
            <div className="home-book-call-container-wraper">
              <div className="home-book-call-container">
                <Suspense fallback={<SkeletonCard count={1} />}>
                  <Section12 templateId={homeData?.top_banner?.book_call_template_id} />
                </Suspense>
              </div>
            </div>
          )}
          
          <Suspense fallback={<SkeletonCard count={1} />}>
            <BusinessCareerSection />
          </Suspense>
        </div>
      </div>
    </>
  );
}
