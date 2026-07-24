import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';

describe('PropertyFilters', () => {
    it('renders all fields correctly', () => {
        render(<PropertyFilters onSearch={jest.fn()} />);

        expect(screen.getByPlaceholderText('e.g. 29 Palms')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. 92277')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. 400000')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. 1000000')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    });

    it('calls onSearch with correct filters when clicking Search', () => {
        const mockOnSearch = jest.fn();
        render(<PropertyFilters onSearch={mockOnSearch} />);

        fireEvent.change(screen.getByPlaceholderText('e.g. 29 Palms'), { 
            target: { name: 'city', value: '29 Palms' } 
        });

        fireEvent.change(screen.getByPlaceholderText('e.g. 400000'), {
            target: { name: 'minPrice', value: '100000' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Search' }));

        expect(mockOnSearch).toHaveBeenCalledWith(expect.objectContaining({
            city: '29 Palms',
            minPrice: '100000'
        }));
    });

    it('shows validation error when minPrice is greater than or equal to maxPrice', () => {
        render(<PropertyFilters onSearch={jest.fn()} />);

        fireEvent.change(screen.getByPlaceholderText('e.g. 400000'), {
            target: { name: 'minPrice', value: '100000' }
        });

        fireEvent.change(screen.getByPlaceholderText('e.g. 1000000'), {
            target: { name: 'maxPrice', value: '90000' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Search' }));

        expect(screen.getByText('Maximum price must be bigger than minimum price.')).toBeInTheDocument();
    });
});