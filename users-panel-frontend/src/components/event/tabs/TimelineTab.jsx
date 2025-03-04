import React from 'react';
import { Flag, Star, User, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

function TimelineTab({ event }) {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy 'at' h:mm a");
  };

  const getDuration = () => {
    const start = new Date(event.dateTime.start);
    const end = new Date(event.dateTime.end);
    const diff = end - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let duration = "";
    if (hours > 0) {
      duration += `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (minutes > 0) {
      duration += `${hours > 0 ? " " : ""}${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    return duration || "0 minutes";
  };

  return (
    <div className="relative pl-8 sm:pl-10 pr-2 sm:pr-4 py-8">
      {/* Vertical Timeline Line */}
      <div className="absolute left-4 top-0 bottom-0 w-2 sm:w-3 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full" />

      {/* Timeline Events */}
      <div className="space-y-12 sm:space-y-16">
        {/* End Date */}
        <div className="relative group">
          <div className="absolute -left-7 sm:-left-10 p-2.5 sm:p-3 bg-gray-400 rounded-full shadow-lg shadow-indigo-100 z-10 transform transition-transform duration-300 group-hover:scale-110">
            <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border-l-4 border-indigo-600 hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">Event Ends</h3>
              <span className="text-indigo-600 text-[10px] sm:text-xs font-medium px-2 py-1 bg-indigo-50 rounded-full">
                FINAL
              </span>
            </div>
            <p className="text-gray-600 mt-2 flex items-center gap-2 text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" />
              <span>{formatDate(event.dateTime.end)}</span>
            </p>
          </div>
        </div>

        {/* Duration Indicator */}
        <div className="relative my-8 sm:my-10">
          <div 
            className="absolute left-12 sm:left-24 -top-12 h-full border-l-2 border-dashed border-indigo-200" 
            style={{ height: '100px' }} 
          />
          <div className="ml-12 sm:ml-24 text-indigo-600 font-medium flex items-center gap-2 px-3 py-1 rounded-full w-fit bg-indigo-50">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-sm">{getDuration()}</span>
          </div>
        </div>

        {/* Start Date */}
        <div className="relative group">
          <div className="absolute -left-7 sm:-left-10 p-2.5 sm:p-3 bg-gray-400 rounded-full shadow-lg shadow-indigo-100 z-10 transform transition-transform duration-300 group-hover:scale-110">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border-l-4 border-indigo-600 hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">Event Starts</h3>
              <span className="text-indigo-600 text-[10px] sm:text-xs font-medium px-2 py-1 bg-indigo-50 rounded-full">
                LAUNCH
              </span>
            </div>
            <p className="text-gray-600 mt-2 flex items-center gap-2 text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" />
              <span>{formatDate(event.dateTime.start)}</span>
            </p>
          </div>
        </div>

        {/* Registration Deadline */}
        {event.registration.isRequired && (
          <div className="relative group">
            <div className="absolute -left-7 sm:-left-10 p-2.5 sm:p-3 bg-gray-400 rounded-full shadow-lg shadow-indigo-100 z-10 transform transition-transform duration-300 group-hover:scale-110">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border-l-4 border-indigo-600 hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  Registration Closes
                </h3>
                <span className="text-indigo-600 text-[10px] sm:text-xs font-medium px-2 py-1 bg-indigo-50 rounded-full">
                  DEADLINE
                </span>
              </div>
              <p className="text-gray-600 mt-2 flex items-center gap-2 text-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" />
                <span>{formatDate(event.registration.deadline)}</span>
              </p>
            </div>
          </div>
        )}

        {/* Event Creation */}
        <div className="relative group">
          <div className="absolute -left-7 sm:-left-10 p-2.5 sm:p-3 bg-gray-400 rounded-full shadow-lg shadow-indigo-100 z-10 transform transition-transform duration-300 group-hover:scale-110">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border-l-4 border-indigo-600 hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">Event Created</h3>
              <span className="text-indigo-600 text-[10px] sm:text-xs font-medium px-2 py-1 bg-indigo-50 rounded-full">
                ORIGIN
              </span>
            </div>
            <p className="text-gray-600 mt-2 flex items-center gap-2 text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" />
              <span>{formatDate(event.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineTab;