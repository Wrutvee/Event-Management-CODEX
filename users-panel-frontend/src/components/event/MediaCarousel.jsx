import { useState } from "react";
function MediaCarousel ({ mediaLinks, coverPhoto }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const allMedia = [coverPhoto, ...mediaLinks.map((media) => media.url)].filter(
    Boolean
  );

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  if (allMedia.length === 0) {
    return (
      <div className="bg-gray-900 h-[400px] flex items-center justify-center">
        <p className="text-white">No media available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 h-[400px] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
        {/* Main Image */}
        <div className="relative h-full rounded-lg overflow-hidden">
          <img
            src={allMedia[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
          {currentIndex + 1} / {allMedia.length}
        </div>
      </div>
    </div>
  );
};

export default MediaCarousel;