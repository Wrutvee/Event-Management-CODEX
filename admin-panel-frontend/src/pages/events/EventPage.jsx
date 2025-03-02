import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageLoader from "../../components/common/PageLoader";
import EventLayout from "../../layout/eventPage/EventLayout";

export default function EventPage() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/events/${eventId}`
        );
        const data = await response.json();
        setEventData(data.event);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  if (isLoading || !eventData) return <PageLoader />;

  return (
    <>
        <EventLayout eventData={eventData} setEventData={setEventData} activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
    
  );
}