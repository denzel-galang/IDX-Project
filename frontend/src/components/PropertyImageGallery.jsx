import React, { useState, useEffect, useCallback } from 'react';
import './PropertyImageGallery.css';

const PropertyImageGallery = ({ photos, address }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [failedUrls, setFailedUrls] = useState(new Set());

    const validPhotos = photos.filter(url => !failedUrls.has(url));

    const handleImgError = useCallback((url) => {
        setFailedUrls(prev => new Set([...prev, url]));
    }, []);

    const openLightbox = useCallback((index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
    }, []);

    const lightboxPrev = useCallback((e) => {
        e.stopPropagation();
        setLightboxIndex(prev => (prev === 0 ? validPhotos.length - 1 : prev - 1));
    }, [validPhotos.length]);

    const lightboxNext = useCallback((e) => {
        e.stopPropagation();
        setLightboxIndex(prev => (prev === validPhotos.length - 1 ? 0 : prev + 1));
    }, [validPhotos.length]);

    useEffect(() => {
        if (!lightboxOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev === 0 ? validPhotos.length - 1 : prev - 1));
            if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev === validPhotos.length - 1 ? 0 : prev + 1));
            if (e.key === 'Escape') closeLightbox();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, validPhotos.length, closeLightbox]);

    useEffect(() => {
        document.body.style.overflow = lightboxOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [lightboxOpen]);

    if (!validPhotos || validPhotos.length === 0) {
        return (
            <div className="gallery__placeholder"> 
                Images unavailable
            </div>
        );
    }

    return (
        <>
            <div className="gallery">
                <div
                    className="gallery__main"
                    onClick={() => openLightbox(activeIndex)}
                >
                    <img
                        src={validPhotos[activeIndex]}
                        alt={`Property at ${address}`}
                        className="gallery__main-image"
                        onError={() => handleImgError(validPhotos[activeIndex])}
                    />
                    <div className="gallery__main-overlay">
                        <span>&#128247; View all {validPhotos.length} photos</span>
                    </div>
                    <div className="gallery__counter">
                        {activeIndex + 1} / {validPhotos.length}
                    </div>
                </div>

                {validPhotos.length > 1 && (
                    <div className="gallery__thumbs">
                        {validPhotos.map((photo, index) => (
                            <button
                                key={index}
                                className={`gallery__thumb-btn ${index === activeIndex ? 'gallery__thumb-btn--active' : ''}`}
                                onClick={() => setActiveIndex(index)}
                                aria-label={`View photo ${index + 1}`}
                            >
                                <img
                                    src={photo}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="gallery__thumb-image"
                                    onError={() => handleImgError(photo)}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {lightboxOpen && (
                <div
                    className="lightbox"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image lightbox"
                >
                    <button
                        className="lightbox__close"
                        onClick={closeLightbox}
                        aria-label="Close lightbox"
                    >
                        &times;
                    </button>

                    <div className="lightbox__counter">
                        {lightboxIndex + 1} / {validPhotos.length}
                    </div>

                    <button
                        className="lightbox__arrow lightbox__arrow--prev"
                        onClick={lightboxPrev}
                        aria-label="Previous Image"
                    >
                        &#8249;
                    </button>

                    <div
                        className="lightbox__image-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={validPhotos[lightboxIndex]}
                            alt={`Property thumbnail ${lightboxIndex + 1}`}
                            className="lightbox__image"
                            onError={() => handleImgError(validPhotos[lightboxIndex])}
                        />
                    </div>

                    <button
                        className="lightbox__arrow lightbox__arrow--next"
                        onClick={lightboxNext}
                        aria-label="Next Image"
                    >
                        &#8250;
                    </button>

                    <div
                        className="lightbox__thumbs"
                        onClick={(e) => e.stopPropagation()}
                    >  
                        {validPhotos.map((photo, index) => (
                            <button
                                key={index}
                                className={`lightbox__thumb-btn ${index === lightboxIndex ? 'lightbox__thumb-btn--active' : ''}`}
                                onClick={() => setLightboxIndex(index)}
                                aria-label={`View photo ${index + 1}`}
                            >
                                <img
                                    src={photo}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="lightbox__thumb-image"
                                    onError={() => handleImgError(photo)}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default PropertyImageGallery;