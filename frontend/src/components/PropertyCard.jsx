import React, { useState } from 'react';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
    const [imgError, setImgError] = useState(false);

    const {
        L_Photos,
        L_SystemPrice,
        L_Address,
        L_City,
        L_State,
        L_Keyword2: beds,
        LM_Dec_3: baths,
        LM_Int2_3: sqft
    } = property;

    // get first photo URL
    const photo = () => {
        try {
            const photoStr = JSON.parse(L_Photos);
            return (Array.isArray(photoStr) && photoStr.length > 0) ? photoStr[0] : null;
        } 
        catch {
            return null;
        }
    };
    const firstPhoto = photo();

    // format price
    const price = L_SystemPrice ? `$${parseInt(L_SystemPrice).toLocaleString()}` : 'Price unavailable';

    return (
        <div className="property-card">
            <div className="property-card__image-container">
                {(firstPhoto && !imgError) ? (
                    <img
                        src={firstPhoto}
                        alt={`Property at ${L_Address}`}
                        className="property-card__image"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="property-card__no-image">Image unavailable</div>
                )}
            </div>
            <div className="property-card__details">
                <p className="property-card__price">{price}</p>
                <p className="property-card__address">{L_Address}</p>
                <p className="property-card__city">{L_City}, {L_State}</p>
                <div className="property-card__stats">
                    <span>{beds} beds</span>
                    <span>.</span>
                    <span>{baths} baths</span>
                    <span>.</span>
                    <span>{parseInt(sqft).toLocaleString()} sqft</span>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;