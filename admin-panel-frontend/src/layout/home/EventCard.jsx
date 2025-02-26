import { useAdminProfile } from '../../context/AdminProfileContext';
import placeholder from '/logos/main_logo.png';
import { MapPin, Calendar, Clock, Edit, Eye, Globe } from "lucide-react";
import { useState, useEffect } from 'react';
import './EventCard.css';

// Create a cache map outside component to persist across renders
export const imageCache = new Map();

export default function EventCard({ event }) {
  const { adminProfile } = useAdminProfile();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fallbackImage, setFallbackImage] = useState(false);
  const imageUrl = event.mediaLinks?.[0] || placeholder;

  // Check if image is already cached on mount
  useEffect(() => {
    if (imageCache.has(imageUrl)) {
      setImageLoaded(true);
      if (imageCache.get(imageUrl) === 'error') {
        setFallbackImage(true);
      }
    }
  }, [imageUrl]);

  // Preload image
  useEffect(() => {
    if (!imageCache.has(imageUrl)) {
      const img = new Image();
      
      img.onload = () => {
        imageCache.set(imageUrl, 'loaded');
        setImageLoaded(true);
      };

      img.onerror = () => {
        imageCache.set(imageUrl, 'error');
        setImageLoaded(true);
        setFallbackImage(true);
      };

      img.src = imageUrl;
    }
  }, [imageUrl]);

  const getTimeRemaining = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target - now;

    // If date is past, return null
    if (diffTime < 0) return null;

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    }
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  };

  const canEdit = () => {
    if (!adminProfile) return false; // Add this check
    if (adminProfile.role === "superadmin") return true;
    return (
      event.organizer.createdBy._id === adminProfile.id ||
      event.organizer.managedBy.includes(adminProfile.id)
    );
  };

  return (
    <div className="w-64 md:w-80 mx-auto flex flex-col items-start gap-2 h-full">
      {/* Upper section - smaller height */}
      <div className="w-full flex justify-center rounded-[1.25rem] relative h-24">
        {/* Image container - positioned to overlap */}
        <div className="absolute z-10 top-8 w-[170px] aspect-square">
          <div className="relative">
            {!imageLoaded && (
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="shimmer w-full h-full" />
              </div>
            )}
            <img
              src={fallbackImage ? placeholder : imageUrl}
              alt={event.title}
              loading='lazy'
              className={`object-cover w-full h-full rounded-lg transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              // Remove onLoad and onError handlers as we're handling this in useEffect
            />
          </div>
        </div>
      </div>

      {/* Lower section - main content box */}
      <div className="overflow-hidden text-center w-full flex flex-col justify-around p-6 relative h-full !pt-32 bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_-3px_rgba(0,0,0,0.1),0_12px_24px_-2px_rgba(0,0,0,0.06)] transition-shadow duration-300">
        {/* Title */}
        <h5 className="font-medium px-1 mt-0.5 text-[1.05rem] text-gray-800 leading-[1.875rem] line-clamp-2 cursor-default">
          {event.title}
        </h5>

        <div className="text-center w-full">
          {/* Event Type */}
          <div className="py-1 text-gray-500 text-[0.8rem] flex items-center justify-center gap-1">
            {event.venue.type === "online" ? (
              <>
                <Globe className="w-3 h-3" />
                <span>Virtual</span>
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3" />
                <span>{event.venue.details}</span>
              </>
            )}
          </div>

          {/* Registration Info */}
          <div className="pb-3 font-medium text-[0.75rem] text-gray-700 flex items-center justify-center w-full mt-2 flex-col gap-1">
            <div className="flex items-center gap-1 mt-2">
              {event.registration.isRequired ? (
                <Calendar className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              <h6>
                {event.registration.isRequired
                  ? "Registration Closing in : "
                  : "Event Starting in : "}
              </h6>
            </div>
            <h5 className="text-gray-500">
              {getTimeRemaining(
                event.registration.isRequired
                  ? event.registration.deadline
                  : event.dateTime.start
              ) || "Closed"}
            </h5>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {canEdit() && (
              <button className="w-full px-4 py-2.5 text-[0.75rem] font-bold text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1">
                <Edit className="w-3 h-3" />
                Edit Event
              </button>
            )}
            <button className="w-full px-4 py-2.5 text-[0.75rem] font-bold text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-[0_2px_24px_0_rgba(0,0,0,0.06)] flex items-center justify-center gap-1">
              <Eye className="w-3 h-3" />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}