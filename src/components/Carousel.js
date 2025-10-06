import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Carousel.css';

const Carousel = ({ images, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div 
          className="carousel-content"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img 
                src={image.src} 
                alt={image.alt || `Slide ${index + 1}`}
                className="carousel-image"
              />
              {image.caption && (
                <div className="carousel-caption">
                  <h3>{image.caption.title}</h3>
                  <p>{image.caption.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {images.length > 1 && (
          <>
            <button 
              className="carousel-button carousel-button-prev"
              onClick={goToPrevious}
              aria-label="Previous slide"
            >
              <FaChevronLeft />
            </button>
            
            <button 
              className="carousel-button carousel-button-next"
              onClick={goToNext}
              aria-label="Next slide"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;

