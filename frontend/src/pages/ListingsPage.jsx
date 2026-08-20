import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import Pagination from '../components/Pagination';
import { fetchProperties } from '../api/client';
import './ListingsPage.css';

const ListingsPage = () => {
    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    const totalPages = Math.ceil(total / itemsPerPage);
    const offset = (currentPage - 1) * itemsPerPage;

    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchProperties({
                     ...filters,
                     limit: itemsPerPage,
                     offset
                 });
                setProperties(data.results);
                setTotal(data.total);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        
        loadProperties();
    }, [currentPage, filters, itemsPerPage, offset]);

    const handleSearch = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // reset to first page when new filters are applied
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // scroll to top on page change
    };

    const lowerBound = offset + 1;
    const upperBound = (offset + itemsPerPage - 1) > total ? total : offset + itemsPerPage;

    return (
        <div className="listings">
            <div className="listings__header">
                <h1>Properties</h1>
                <p>{total?.toLocaleString()} results</p>
            </div>
            <PropertyFilters onSearch={handleSearch} />
            {loading ? (
                <div className="listings__status">Loading properties...</div>
            ) : error ? (
                <div className="listings__status listings__status--error">{error}</div>
            ) : properties.length === 0 ? (
                <div className="listings__status">No properties found. Adjust your filters.</div>
            ) : (
                <>
                    <span>Showing {lowerBound}-{upperBound} of {total} properties</span>
                    <div className="listings__grid">
                        {properties.map((property) => (
                            <PropertyCard key={property.L_ListingID} property={property} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange} 
                    />              
                </>
            )}
        </div>
    );
};

export default ListingsPage;