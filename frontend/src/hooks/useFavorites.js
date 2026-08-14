import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fav_properties';

const useFavorites = () => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        }
        catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        }
        catch {
            console.error('Unable to save favorites to localStorage.');
        }
    }, [favorites]);

    const addFavorite = useCallback((property) => {
        setFavorites(prev => {
            if (prev.some(p => p.L_ListingID === property.L_ListingID)) {
                return prev;
            }
            else return [...prev, property];
        });
    }, []);

    const removeFavorite = useCallback((listingId) => {
        setFavorites(prev => prev.filter(p => p.L_ListingID !== listingId));
    }, []);

    const toggleFavorite = useCallback((property) => {
        setFavorites(prev => {
            const doesExist = prev.some(p => p.L_ListingID === property.L_ListingID);
            if (doesExist) {
                return prev.filter(p => p.L_ListingID !== property.L_ListingID);
            }
            else return [...prev, property];
        });
    }, []);

    const isFavorite = useCallback((listingId) => {
        return favorites.some(p => p.L_ListingID === listingId);
    }, [favorites]);

    return {
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        favoritesCount: favorites.length
    };
};

export default useFavorites;