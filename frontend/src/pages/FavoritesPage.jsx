import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritesContext } from '../utils/FavoritesContext';
import PropertyCard from '../components/PropertyCard';
import './FavoritesPage.css';

const FavoritesPage = () => {
    const { favorites, favoritesCount } = useFavoritesContext();
    const navigate = useNavigate();

    return (
        <div className="favorites">
            <div className="favorites__header">
                <button className="favorites__back" onClick={() => navigate('/')}>
                    ← Back to Listings
                </button>
                <h1>Saved Properties</h1>
                <p>{favoritesCount} {favoritesCount === 1 ? 'property' : 'properties'} saved</p>
            </div>

            {favoritesCount === 0 ? (
                <div className="favorites__empty">
                    <p>You have no favorited properties yet.</p>
                    <button onClick={() => navigate('/')}>Browse Listings</button>
                </div>
            ) : (
                <div className="favorites__grid">
                    {favorites.map(property => (
                        <PropertyCard
                            key={property.L_ListingID}
                            property={property}
                        />
                    ))}  
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;