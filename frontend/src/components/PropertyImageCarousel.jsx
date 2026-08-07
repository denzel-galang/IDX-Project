import React, { useState, useCallback } from 'react';
import './PropertyImageCarousel.css';

const PropertyImageCarousel = ({ photos, address }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [failedUrls, setFailedUrls] = useState(new Set());
    const validPhotos = photos.filter(url => !failedUrls.has(url));

    const handlePrev = useCallback((e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev === 0 ? validPhotos.length - 1 : prev - 1));
    }, [validPhotos.length]);

    const handleNext = useCallback((e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev === validPhotos.length - 1 ? 0 : prev + 1));
    }, [validPhotos.length]);

    const handleImageError = useCallback((url) => {
        setFailedUrls(prev => new Set([...prev, url]));
    }, []);

    if (!photos || photos.length === 0 || validPhotos.length === 0) {
        return (
            <div className="carousel__placeholder">
                Image unavailable
            </div>
        );
    }

    return (
        <div className="carousel">
            <img
                src={validPhotos[currentIndex]}
                alt={`Property at ${address} - photo ${currentIndex + 1}`}
                className="carousel__image"
                onError={() => handleImageError(validPhotos[currentIndex])}
            />
            {validPhotos.length > 1 && (
                <>
                    <button
                        className="carousel__arrow carousel__arrow--prev"
                        onClick={handlePrev}
                        aria-label="Previous Image"
                    >
                        &#8249;
                    </button>
                    <button
                        className="carousel__arrow carousel__arrow--next"
                        onClick={handleNext}
                        aria-label="Next Image"
                    >
                        &#8250;
                    </button>

                    <div className="carousel__counter">
                        {currentIndex + 1} / {validPhotos.length}
                    </div>

                    <div className="carousel__dots">
                        {validPhotos.slice(0, 10).map((_, index) => (
                            <button
                                key={index}
                                className={`carousel__dot ${index === currentIndex ? 'carousel__dot--active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PropertyImageCarousel;