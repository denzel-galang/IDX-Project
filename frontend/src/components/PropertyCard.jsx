import { useNavigate } from 'react-router-dom';
import PropertyImageCarousel from './PropertyImageCarousel';
import React from 'react';
import './PropertyCard.css';
import FavoriteButton from './FavoriteButton';

//throw new Error('crash test');

const PropertyCard = ({ property }) => {
    const navigate = useNavigate();

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

    const getPhotos = () => {
        try {
            const photos = typeof L_Photos === 'string' ? JSON.parse(L_Photos) : L_Photos;
            if (!Array.isArray(photos)) return [];
            return photos.filter(url => {
                try {
                    new URL(url);
                    return true;
                }
                catch {
                    return false;
                }
            })
        } 
        catch {
            return [];
        }
    };
    const photos = getPhotos();

    // format price
    const price = L_SystemPrice ? `$${parseInt(L_SystemPrice).toLocaleString()}` : 'Price unavailable';

    return (
        <div 
            className="property-card"
            onClick={() => navigate(`/property/${property.L_ListingID}`)}
        >
            <div className="property-card__image-wrapper">
                <PropertyImageCarousel photos={photos} address={L_Address} />
                <div className="property-card__favorite">
                    <FavoriteButton property={property} size="md" />
                </div>
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