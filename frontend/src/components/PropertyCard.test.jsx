import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesContext } from '../utils/FavoritesContext';
import PropertyCard from './PropertyCard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockFavoritesContext = {
    isFavorite: jest.fn(() => false),
    toggleFavorite: jest.fn(),
    favorites: [],
    favoritesCount: 0,
    addFavorite: jest.fn(),
    removeFavorite: jest.fn()
};

const mockProperty = {
    L_ListingID: '123',
    L_Address: '123 Main St',
    L_City: 'Jacksonville',
    L_State: 'FL',
    L_Zip: '32099',
    L_SystemPrice: 350000,
    L_Keyword2: 3,
    LM_Dec_3: 2.0,
    LM_Int2_3: 1800,
    L_Status: 'Active',
    L_Photos: JSON.stringify(['https://example.com/photo1.jpg'])
};

const renderCard = (property = mockProperty) =>
    render(
        <MemoryRouter>
            <FavoritesContext.Provider value={mockFavoritesContext}>
                <PropertyCard property={property} />
            </FavoritesContext.Provider>
        </MemoryRouter>
    );

describe('PropertyCard', () => {

    beforeEach(() => jest.clearAllMocks());

    // Renders property data
    it('renders the formatted price', () => {
        renderCard();
        expect(screen.getByText('$350,000')).toBeInTheDocument();
    });

    it('renders the address', () => {
        renderCard();
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });

    it('renders the city and state', () => {
        renderCard();
        expect(screen.getByText('Jacksonville, FL')).toBeInTheDocument();
    });

    it('renders beds, baths, and sqft stats', () => {
        renderCard();
        expect(screen.getByText(/3 beds/)).toBeInTheDocument();
        expect(screen.getByText(/2 baths/)).toBeInTheDocument();
        expect(screen.getByText(/1,800 sqft/)).toBeInTheDocument();
    });

    // Clicking navigates to detail page
    it('navigates to the property detail page when the card is clicked', () => {
        renderCard();
        fireEvent.click(screen.getByText('123 Main St'));
        expect(mockNavigate).toHaveBeenCalledWith('/property/123');
    });

    // Heart button does not trigger navigation
    it('does not navigate when the favorite button is clicked', () => {
        renderCard();
        const heartBtn = screen.getByRole('button', { name: /add to favorites/i });
        fireEvent.click(heartBtn);
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('calls toggleFavorite when the heart button is clicked', () => {
        renderCard();
        const heartBtn = screen.getByRole('button', { name: /add to favorites/i });
        fireEvent.click(heartBtn);
        expect(mockFavoritesContext.toggleFavorite).toHaveBeenCalledWith(mockProperty);
    });

    it('shows a filled heart when the property is favorited', () => {
        mockFavoritesContext.isFavorite.mockReturnValueOnce(true);
        renderCard();
        expect(screen.getByRole('button', { name: /remove from favorites/i })).toBeInTheDocument();
    });
});