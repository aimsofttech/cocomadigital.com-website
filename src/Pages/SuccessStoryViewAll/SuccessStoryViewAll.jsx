import { useEffect, useState } from "react";
import "./SuccessStoryViewAll.css";
import Section12 from "../../components/Home/Section12/section12";
import ProjectSucess from "../../components/WebSeries/ProjectSuccess/ProjectSucess";
import AdminService from "../../Service/apiService";
import SuccessStoriesViewAll from "../../components/SuccessStory/ViewAll";
import MarketingHouseBanner from "../../components/SingleVideo/MarkatingHouseBanner/MarkatingHouseBanner";

const SuccessStoryViewAll = () => {
    const [ViewAllSeriesId, setViewAllSeriesId] = useState(null);
    const [bookCallId, setBookCallId] = useState(null);

    useEffect(() => {
        const fetchSuccessStory = async () => {
            try {
                const response = await AdminService?.getViewAllSuccessStory();
                setViewAllSeriesId(response?.data?.data?.success_stories_View_all);
                setBookCallId(response?.data?.data?.book_call_template_id);
            } catch (error) {
                console.log("error", error);
            }
        }
        fetchSuccessStory();
    },[])


    return (
        <>
            <MarketingHouseBanner
                bannerId={ViewAllSeriesId?.banner_title_template_id}
            />
            <div className="view-all-series-content-wrapper">
                <div className="view-all-series-content">
                    <SuccessStoriesViewAll/>
                    <Section12
                        templateId={bookCallId}
                    />
                    <ProjectSucess />
                </div>
            </div>
        </>
    );
};

export default SuccessStoryViewAll;
