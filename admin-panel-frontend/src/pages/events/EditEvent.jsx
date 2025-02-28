import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addCsrfToken, fetchCsrfToken } from '../../utils/csrf';
import Navbar from '../../components/navbar/Navbar';
import EventForm from './components/EventForm';
import PageLoader from '../../components/common/PageLoader';

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        await fetchCsrfToken();
        const response = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/events/${eventId}`,
          {
            headers: addCsrfToken(),
            credentials: "include",
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch event");
        }

        setEvent(data.event);
      } catch (error) {
        setError(error.message);
        alert(loadingError);
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (_,formData) => {
    try {
      await fetchCsrfToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/events/update/${eventId}`,
        {
          method: "PUT",
          headers: addCsrfToken({
            "Content-Type": "application/json",
          }),
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update event");
      }

      navigate("/home");
    } catch (error) {
      return error.message
    } finally {
      return true;
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Event: {event?.title}
          </h1>
          <EventForm
            initialData={event}
            onSubmit={handleSubmit}
            submitButtonText="Save Changes"
            mode="edit"
          />
        </div>
      </main>
    </div>
  );
}