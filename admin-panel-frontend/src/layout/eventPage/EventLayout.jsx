import Navbar from "../../components/navbar/Navbar";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import EventTabs from "./EventTabs";
import OverviewTab from "../../components/eventPage/OverviewTab";
import TimelineTab from "../../components/eventPage/TimelineTab";
import ResourcesTab from "../../components/eventPage/ResourcesTab";
import FeedbackTab from "../../components/eventPage/FeedbackTab";
import Analytics from "../../components/eventPage/Analytics";
import AttendanceTab from "../../components/eventPage/Attendance";

export default function EventLayout({ eventData, setEventData, activeTab, setActiveTab }) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="pt-20">
          {/* Media Carousel */}
          <div className="h-[400px] bg-gray-900">
            <Carousel
              showThumbs={false}
              infiniteLoop
              showStatus={false}
              autoPlay
              interval={5000}
              className="h-full"
            >
              {eventData.mediaLinks?.map((media, index) => (
                <div key={index} className="h-[400px]">
                  {media.type?.startsWith("image/") ? (
                    <img
                      src={media.url}
                      alt={`Event media ${index + 1}`}
                      className="object-contain h-full w-full"
                    />
                  ) : (
                    <video controls className="h-full w-full">
                      <source src={media.url} type={media.type} />
                    </video>
                  )}
                </div>
              ))}
            </Carousel>
          </div>

          {/* Event Title and Basic Info */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {eventData.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>Category: {eventData.category}</span>
                <span>•</span>
                <span>
                  {eventData.venue.type === "online"
                    ? "Virtual Event"
                    : eventData.venue.details}
                </span>
              </div>
            </div>

            {/* Tabs Navigation and Content */}
            <div>
              <EventTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="bg-white rounded-b-lg shadow-sm">
                {/* Render tab content based on activeTab */}

                {activeTab === "overview" && (
                  <OverviewTab eventData={eventData} />
                )}

                {activeTab === "timeline" && (
                  <TimelineTab eventData={eventData} />
                )}

                {activeTab === "resources" && (
                  <ResourcesTab eventData={eventData} />
                )}

                {activeTab === "feedback" && (
                  <FeedbackTab
                    eventData={eventData}
                    onUpdate={(updatedEvent) => {
                      setEventData(updatedEvent);
                    }}
                  />
                )}

                {activeTab === "analytics" && (
                  <Analytics eventData={eventData} />
                )}

                {activeTab === "attendance" && (
                  <AttendanceTab eventData={eventData} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
}