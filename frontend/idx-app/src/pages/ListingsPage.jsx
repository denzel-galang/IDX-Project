import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties } from '../api/client';
import './ListingsPage.css';

const ListingsPage = () => {
    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const limit = 20;

    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchProperties({ limit, offset });
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
    }, [offset]);

    if (loading) return <div className="listings__status">Loading properties...</div>;
    if (error) return <div className="listings__status listings__status--error">{error}</div>;

    const lowerBound = offset + 1;
    const upperBound = offset + limit;

    return (
        <div className="listings">
            <div className="listings__header">
                <h1>Properties</h1>
                <p>{total?.toLocaleString()} results</p>
            </div>
            <div className="listings__grid">
                {properties.map((property) => (
                    <PropertyCard key={property.L_ListingID} property={property} />
                ))}
            </div>
            <div className="listings__pagination">
                <button
                    onClick={()=> setOffset(offset - limit)}
                    disabled={offset === 0}
                >
                    Previous
                </button>
                <span>Showing {lowerBound}-{upperBound} of {total} properties</span>
                <button
                    onClick={() => setOffset(offset + limit)}
                    disabled={offset + limit >= total}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ListingsPage;