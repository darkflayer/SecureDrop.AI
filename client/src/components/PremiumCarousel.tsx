import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
  gradient: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "Anonymous & Secure",
    description: "Your identity is protected with enterprise-grade encryption. Submit feedback without fear of retaliation.",
    image: "🛡️",
    gradient: "from-blue-600 to-purple-600"
  },
  {
    id: 2,
    title: "Real-Time Communication",
    description: "Get instant updates and communicate directly with organizations through our secure messaging system.",
    image: "⚡",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    title: "AI-Powered Insights",
    description: "Our advanced AI analyzes feedback patterns to help organizations improve faster and more effectively.",
    image: "🤖",
    gradient: "from-purple-600 to-pink-600"
  },
  {
    id: 4,
    title: "Global Impact",
    description: "Join thousands of users worldwide making their voices heard and driving positive change in organizations.",
    image: "🌍",
    gradient: "from-orange-500 to-red-500"
  }
];

const PremiumCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Carousel Container */}
      <div 
        className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-white dark:bg-gray-800 shadow-xl lg:shadow-2xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems.map((item) => (
            <div key={item.id} className="w-full flex-shrink-0">
              <div className={`relative bg-gradient-to-br ${item.gradient} p-6 sm:p-8 lg:p-12 xl:p-16 text-white min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex items-center`}>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl mb-4 lg:mb-6 transform hover:scale-105 transition-transform duration-300">
                    {item.image}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed px-4">
                    {item.description}
                  </p>
                </div>
                
                {/* Subtle Professional Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 lg:w-40 lg:h-40 bg-white/5 rounded-full blur-xl" />
                  <div className="absolute top-1/2 -left-20 w-40 h-40 lg:w-60 lg:h-60 bg-white/3 rounded-full blur-2xl" />
                  <div className="absolute bottom-10 right-1/3 w-24 h-24 lg:w-32 lg:h-32 bg-white/5 rounded-full blur-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
        <button
          onClick={goToPrevious}
          className="hidden sm:block absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 lg:p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        
        <button
          onClick={goToNext}
          className="hidden sm:block absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 lg:p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 lg:mt-8 space-x-2 lg:space-x-3">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-blue-600 dark:bg-blue-400 scale-125 shadow-lg'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Toggle & Swipe Hint */}
      <div className="flex flex-col sm:flex-row justify-center items-center mt-3 lg:mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
        >
          {isAutoPlaying ? 'Pause Auto-play' : 'Resume Auto-play'}
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-500 sm:hidden">
          Swipe to navigate
        </span>
      </div>
    </div>
  );
};

export default PremiumCarousel;
