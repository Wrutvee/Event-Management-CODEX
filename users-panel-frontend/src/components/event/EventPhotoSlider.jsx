import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';

function EventPhotoSlider({ event }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
  
// Prepare media array with cover photo first, then other media
const mediaArray = event.coverPhoto 
? [{ url: event.coverPhoto, type: 'image' }, ...(event.mediaLinks || [])]
: event.mediaLinks || [];
  
  // If no media, use a placeholder
  const hasMedia = mediaArray.length > 0;
  
  useEffect(() => {
    if (hasMedia) {
      const img = new Image();
      img.src = mediaArray[currentIndex].url;
      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [currentIndex, hasMedia, mediaArray]);
  
  const goToPrevious = () => {
    setIsLoading(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? mediaArray.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  
  const goToNext = () => {
    setIsLoading(true);
    const isLastSlide = currentIndex === mediaArray.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex) => {
    if (slideIndex !== currentIndex) {
      setIsLoading(true);
      setCurrentIndex(slideIndex);
    }
  };
  
  // If no media, show a placeholder
  if (!hasMedia) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-64 md:h-96">
      {/* Main Image */}
      <div className="w-full h-full overflow-hidden bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        )}
        <img
          src={mediaArray[currentIndex].url}
          alt={`Event photo ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>
      
      {/* Navigation Arrows */}
      {mediaArray.length > 1 && (
        <>
          <div 
            className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white cursor-pointer shadow-md"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </div>
          <div 
            className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white cursor-pointer shadow-md"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </div>
        </>
      )}
      
      {/* Dots Navigation */}
      {mediaArray.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {mediaArray.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                slideIndex === currentIndex ? 'bg-indigo-600' : 'bg-white/70 hover:bg-white'
              }`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventPhotoSlider;