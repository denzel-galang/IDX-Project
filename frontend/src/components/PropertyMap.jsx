import React, { useState } from 'react';
import './PropertyMap.css';

const PropertyMap = ({ latitude, longitude, address }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="map__error">
                Google Maps API key is missing. Please set the REACT_APP_GOOGLE_MAPS_API_KEY environment variable.
            </div>
        );
    }
    
    if (!latitude || !longitude) {
        return (
            <div className="map__error">
                Location data is unavailable for this property.
            </div>
        );
    }

    const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`;

    return (
        <div className="map">
            {!loaded && !error && (
                <div className="map__loading">Loading map...</div>
            )}
            {error && (
                <div className="map__error">Failed to load map. Please try again later.</div>
            )}
            <iframe
                title={`Map of ${address}`}
                src={mapSrc}
                className={`map__iframe ${loaded ? 'map__iframe--visible' : ''}`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
            />
        </div>
    );
};

export default PropertyMap;