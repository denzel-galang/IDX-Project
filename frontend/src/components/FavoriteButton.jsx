import React from 'react';
import { useFavoritesContext } from '../context/FavoritesContext';
import './FavoriteButton.css';

const FavoriteButton = ({ property, size = 'md' }) => {
    const { isFavorite, toggleFavorite } = useFavoritesContext();
    const favorited = isFavorite(property.L_ListingID);

    const handleClick = (e) => {
        e.stopPropagation();
        toggleFavorite(property);
    };

    return (
        <button
            className={`favorite-btn favorite-btn--${size} ${favorited ? 'favorite-btn--active' : ''}`}
            onClick={handleClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            {favorited ? '♥' : '♡'}
        </button>
    );
};

export default FavoriteButton;