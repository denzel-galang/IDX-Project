import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
    it('renders correctly on the first page', () => {
        render(<Pagination currentPage={1} totalPages={20} onPageChange={jest.fn()} />);

        expect(screen.getByRole('button', { name: '1'})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '2'})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '3'})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '4'})).toBeInTheDocument();
        expect(screen.getByText('...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '20'})).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Previous'})).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Next'})).not.toBeDisabled();
    });

    it('renders correctly on the last page', () => {
        render(<Pagination currentPage={20} totalPages={20} onPageChange={jest.fn()} />);

        expect(screen.getByRole('button', { name: '1'})).toBeInTheDocument();
        expect(screen.getAllByText('...').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByRole('button', { name: '17'})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '18'})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '19'})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '20'})).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Next'})).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Previous'})).not.toBeDisabled();
    });

    it('renders correctly on a middle page', () => {
        render(<Pagination currentPage={10} totalPages={20} onPageChange={jest.fn()} />);

        expect(screen.getByRole('button', { name: '1'})).toBeInTheDocument();
        expect(screen.getAllByText('...')).toHaveLength(2);
        expect(screen.getByRole('button', { name: '9'})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '10'})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '11'})).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '20'})).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Previous'})).not.toBeDisabled();
        expect(screen.getByRole('button', { name: 'Next'})).not.toBeDisabled();
    });

    it('calls onPageChange with correct page number when clicking on a page number', () => {
        const mockOnPageChange = jest.fn();
        render(<Pagination currentPage={1} totalPages={20} onPageChange={mockOnPageChange} />);

        fireEvent.click(screen.getByRole('button', { name: '3'}));
        expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange with correct page number when clicking on either Previous or Next', () => {
        const mockOnPageChange = jest.fn();
        render(<Pagination currentPage={5} totalPages={20} onPageChange={mockOnPageChange} />);
        
        fireEvent.click(screen.getByRole('button', { name: 'Previous'}));
        expect(mockOnPageChange).toHaveBeenCalledWith(4);

        fireEvent.click(screen.getByRole('button', { name: 'Next'}));
        expect(mockOnPageChange).toHaveBeenCalledWith(6);
    });

    it('renders ellipsis correctly for large total of pages', () => {
        const { rerender } = render(<Pagination currentPage={1} totalPages={20} onPageChange={jest.fn()} />);
        expect(screen.getAllByText('...')).toHaveLength(1);

        rerender(<Pagination currentPage={10} totalPages={20} onPageChange={jest.fn()} />);
        expect(screen.getAllByText('...')).toHaveLength(2);

        rerender(<Pagination currentPage={20} totalPages={20} onPageChange={jest.fn()} />);
        expect(screen.getAllByText('...')).toHaveLength(1);
    });

    it('does not render for 0 or 1 total page', () => {
        const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />);
        expect(container.firstChild).toBeNull();
    });

    it('highlights the current page correctly', () => {
        render(<Pagination currentPage={3} totalPages={20} onPageChange={jest.fn()} />);

        const activeButton = screen.getByRole('button', { name: '3'});
        expect(activeButton).toHaveClass('pagination__btn--active');

        const inactiveButton = screen.getByRole('button', { name: '2'});
        expect(inactiveButton).not.toHaveClass('pagination__btn--active');
    });
});