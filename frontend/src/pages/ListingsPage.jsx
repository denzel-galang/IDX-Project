import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import { fetchProperties } from '../api/client';
import './ListingsPage.css';

const ListingsPage = () => {
    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState({});
    const limit = 20;

    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchProperties({ ...filters,limit, offset });
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
    }, [offset, filters]);

    const handleSearch = (newFilters) => {
        console.log("New filters applied...:", newFilters);
        setFilters(newFilters);
        setOffset(0); // reset offset when new filters are applied
    }

    const lowerBound = offset + 1;
    const upperBound = offset + limit;

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
                    <div className="listings__grid">
                        {properties.map((property) => (
                            <PropertyCard key={property.L_ListingID} property={property} />
                        ))}
                    </div>                    
                </>
            )}
        </div>
    );
};

export default ListingsPage;