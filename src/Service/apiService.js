import instance from "./router";

class AdminService {

  async Home(params) {
    return instance.get(`/home?lang=${params}&service_category_id=4`);
  }

  async homeAllCategories() {
    return instance.get(`/categories`);
  }

  async Brands() {
    return instance.get("/brand");
  }

  // old service api
  async service() {
    return instance.get("/service_detail");
  }

  // new service api
  async Services(params) {
    return instance.get("/service_home_priority", { params });
  }

  async GroupService(slug) {
    return instance.get(`/service/group_service/${slug}`);
  }

  async ServiceDetails(slug) {
    return instance.get(`/service/get_single_service/${slug}`);
  }

  async ServicePortfolio(params) {
    return instance.get(`/service/get_portfolio_item`, { params });
  }

  async CreativeHouse() {
    return instance.get("/creative_house");
  }
  //  new
  async CreativeHouseDetails() {
    return instance.get("/creative_filter_data");
  }

  async fetchCreativeHouse(params) {
    return instance.get("/creative_home_priority", { params });
  }

  async CreativeSingleVideo(slug) {
    return instance.get(`creative/get_single_creative_house/${slug}`);
  }

  async HireUS() {
    return instance.get("/hire_us");
  }

  async Banners() {
    return instance.get("/banner_title");
  }

  // old
  async MarkatingHouse() {
    return instance.get("/marketing_house");
  }

  // New
  async MarketingHouse(params) {
    return instance.get("/marketing_home_priority", { params });
  }
  // New
  async MarketingHouseDetails(slug) {
    return instance.get(`/marketing/get_single_marketing_house/${slug}`);
  }
  // New
  async OtherActivities(params) {
    return instance.get(`/marketing/get_marketing_other_activity_item`, { params });
  }
  // New
  async MarketingContentCreated(params) {
    return instance.get(`/marketing/get_marketing_content_created_item`, { params });
  }
  // New
  async MarketingContentCreatedCarousels(params) {
    return instance.get(`/marketing/get_marketing_content_created_carousal`, { params });
  }
  // New
  async ContinuityProgram(params) {
    return instance.get(`marketing/get_marketing_continuity_program_item`, { params });
  }

  async MonthlyPerformance() {
    return instance.get("/monthly_performance_showcase");
  }

  async BookACall(id) {
    return instance.get(`/book_call?id=${id}`);
  }

  async JobDetails(slug) {
    return instance.get(`/job/get_job_detail/${slug}`);
  }

  async getCareerJobData(params) {
    return instance.get("/job/get_job_list", { params });
  }

  async getAllCategory() {
    return instance.get("/marketing_filter_data");
  }

  async getAllSeries(params) {
    return instance.get("/marketing_house_item", { params });
  }

  async marketingHouseContentGallery(params) {
    return instance.get("/marketing/get_marketing_content_created_carousal", { params });
  }

  async CreativeHouseItems(params) {
    return instance.get("/creative_house_item", { params });
  }

  async getBlogCategory() {
    return instance.get("/blog_category");
  }

  async getBlogs(params) {
    return instance.get("/blog_item", { params });
  }

  async getBlogDetails(slug) {
    return instance.get(`/get_blog_detail/${slug}`);
  }

  // Done
  async ClientSuccessStoryDetails(slug) {
    return instance.get(`/client/get_client_detail/${slug}`);
  }

  async getViewAllSuccessStory() {
    return instance.get("/success_stories_filter_data");
  }

  async getViewAllSuccessStoryItems(params) {
    return instance.get("/success_stories_view_all", { params });
  }

  // POST API FETCH
  async FreeConsultation(data) {
    return instance.post("/free_consultation", data);
  }

  async ContactUs(data) {
    return instance.post("/contact", data);
  }

  async CommonApi() {
    return instance.get("/common-api");
  }

  async JobApplication(data) {
    return instance.post("/job_applicants", data);
  }

}

// Assign the instance to a variable
const adminServiceInstance = new AdminService();

// Export the variable
export default adminServiceInstance;
