import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({ event }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img
          className="h-48 w-full object-cover rounded-t-lg"
          src={event.image}
          alt={event.title}
        />
        {event.isRegistered && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            Registered
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
        <p className="mt-2 text-sm text-gray-500">{event.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()}
          </div>
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;