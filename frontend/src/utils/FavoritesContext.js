import React, { createContext, useContext } from 'react';
import useFavorites from '../hooks/useFavorites';

export const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
    const favorites = useFavorites();
    return (
        <FavoritesContext.Provider value={favorites}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavoritesContext = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavoritesContext must be used in FavoritesProvider');
    }
    return context;
};