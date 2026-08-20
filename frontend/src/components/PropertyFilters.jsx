import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PropertyFilters.css';

const BED_BATH_OPTIONS = [1, 2, 3, 4, 5];

const PropertyFilters = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        city: '',
        zipCode: '',
        minPrice: '',
        maxPrice: '',
        beds: '',
        baths: ''
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (filters.minPrice && isNaN(filters.minPrice)) {
            newErrors.minPrice = 'Minimum price must be a number.';
        }
        if (filters.maxPrice && isNaN(filters.maxPrice)) {
            newErrors.maxPrice = 'Maximum price must be a number.';
        }
        if (filters.minPrice && filters.maxPrice && parseFloat(filters.minPrice) >= parseFloat(filters.maxPrice)) {
            newErrors.maxPrice = 'Maximum price must be bigger than minimum price.';
        }
        if (filters.zipCode && !/^\d{5}$/.test(filters.zipCode)) {
            newErrors.zipCode = 'Zip code must be 5 digits.';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null}));
    };

    const handleSearch = () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSearch(filters);
    }

    const handleReset = () => {
        setFilters({
            city: '',
            zipCode: '',
            minPrice: '',
            maxPrice: '',
            beds: '',
            baths: ''
        });
        setErrors({});
        onSearch({});
    }

    return (
        <div className="filters">
            <div className="filters__row">
                <div className="filters__field">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        value={filters.city}
                        onChange={handleChange}
                        placeholder="e.g. 29 Palms"
                    />
                </div>
                <div className="filters__field">
                    <label>Zip Code</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={filters.zipCode}
                        onChange={handleChange}
                        placeholder="e.g. 92277"
                    />
                    {errors.zipCode && <span className="filters_error">{errors.zipCode}</span>}
                </div>
                <div className="filters__field">
                    <label>Min Price</label>
                    <input
                        type="text"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleChange}
                        placeholder="e.g. 400000"
                    />
                    {errors.minPrice && <span className="filters_error">{errors.minPrice}</span>}
                </div>
                <div className="filters__field">
                    <label>Max Price</label>
                    <input
                        type="text"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        placeholder="e.g. 1000000"
                    />
                    {errors.maxPrice && <span className="filters_error">{errors.maxPrice}</span>}
                </div>
                <div className="filters__field">
                    <label>Beds</label>
                    <select name="beds" value={filters.beds} onChange={handleChange}>
                        <option value="">Any</option>
                        {BED_BATH_OPTIONS.map(n => (
                            <option key={n} value={n}>{n}+</option>
                        ))}
                    </select>
                </div>
                <div className="filters__field">
                    <label>Baths</label>
                    <select name="baths" value={filters.baths} onChange={handleChange}>
                        <option value="">Any</option>
                        {BED_BATH_OPTIONS.map(n => (
                            <option key={n} value={n}>{n}+</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="filters__actions">
                <button className="filters__search" onClick={handleSearch}>Search</button>
                <button className="filters__reset" onClick={handleReset}>Reset</button>
            </div>
        </div>
    )
};

PropertyFilters.propTypes = {
    onSearch: PropTypes.func.isRequired
};

export default PropertyFilters;