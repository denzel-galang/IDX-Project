import React from 'react';
import PropTypes from 'prop-types';
import { useFavoritesContext } from '../utils/FavoritesContext';
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

FavoriteButton.propTypes = {
    property: PropTypes.shape({
        L_ListingID: PropTypes.string.isRequired
    }).isRequired,
    size: PropTypes.oneOf(['md', 'lg'])
};

FavoriteButton.defaultProps = {
    size: 'md'
};

export default FavoriteButton;