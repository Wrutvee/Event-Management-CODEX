import EventCard from './EventCard';

export default function EventsGrid({ events }) {
  if (!events.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No events found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}