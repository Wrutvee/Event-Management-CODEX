import { addCsrfToken, fetchCsrfToken } from "../../utils/csrf";
import { useAdminProfile } from "../../context/AdminProfileContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import EventForm from "./components/EventForm";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { adminProfile } = useAdminProfile();


  const handleSubmit = async (isDraft, formData) => {
    if (isDraft) {
      // Handle draft saving
      try {
        const existingDrafts = JSON.parse(
          localStorage.getItem("eventDrafts") || "[]"
        );
        if (existingDrafts.length >= 3) {
          throw new Error("Draft limit reached");
        }

        const draftData = {
          id: `event_draft_${Date.now()}`,
          lastModified: new Date().toISOString(),
          data: formData,
        };

        const updatedDrafts = [...existingDrafts, draftData];
        localStorage.setItem("eventDrafts", JSON.stringify(updatedDrafts));
        
        // Add alert and navigation
        alert("Draft saved successfully!");
        navigate("/home");
        return true;
      } catch (error) {
        throw new Error(error.message || "Failed to save draft");
      }
    }

    // Handle event creation
    try {
      await fetchCsrfToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/events/create`,
        {
          method: "POST",
          headers: addCsrfToken({
            "Content-Type": "application/json",
          }),
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            organizer: {
              ...formData.organizer,
              createdBy: adminProfile._id,
            },
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      navigate("/home");
    } catch (error) {
      throw new Error(error.message || "Error creating event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Host New Event
          </h1>
          <EventForm
            onSubmit={handleSubmit}
            submitButtonText="Publish Event"
            mode="create"
          />
        </div>
      </main>
    </div>
  );
}