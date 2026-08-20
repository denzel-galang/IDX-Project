import React from 'react';
import PropTypes from 'prop-types';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages);
        }
        else if (currentPage >= totalPages - 2) {
            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        }
        else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination" data-testid="pagination">
            <button
                className="pagination__btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {getPageNumbers().map((page, index) => 
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="pagination__ellipsis">...</span>
                ) : (
                    <button
                        key={page}
                        className={`pagination-btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                className="pagination__btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
};

export default Pagination;