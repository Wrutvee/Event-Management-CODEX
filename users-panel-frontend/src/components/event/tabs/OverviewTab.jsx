import React from 'react';
import { Calendar, Clock, MapPin, Users, Mail, Phone, Tag } from 'lucide-react';
import { format } from 'date-fns';

function OverviewTab({ event }) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return 'Date to be announced';
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Event</h3>
        <div 
          className="prose prose-sm max-w-none text-gray-500"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      </div>

      {/* Date & Time */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Date and Time</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-gray-400 mt-1" />
            <div className="ml-3">
              <p className="text-gray-900">{formatDate(event.dateTime.start)}</p>
              <p className="text-gray-500">
                {formatTime(event.dateTime.start)} - {formatTime(event.dateTime.end)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div className="ml-3">
              <p className="text-gray-900">{event.venue.details}</p>
              {event.venue.address && (
                <p className="text-gray-500">{event.venue.address}</p>
              )}
              {event.venue.type === "hybrid" && (
                <p className="text-indigo-600 mt-2">
                  This is a hybrid event (both in-person and online)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Organizer */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="ml-3 text-gray-900">{event.organizer.name}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-gray-400" />
            <a 
              href={`mailto:${event.organizer.email}`}
              className="ml-3 text-indigo-600 hover:text-indigo-800"
            >
              {event.organizer.email}
            </a>
          </div>
          {event.organizer.contact && (
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="ml-3 text-gray-900">{event.organizer.contact}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OverviewTab;