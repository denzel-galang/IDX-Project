const URL = 'http://localhost:5000/api/properties';

// GET /api/client
export const fetchProperties = async ({
    city,
    zipCode,
    minPrice,
    maxPrice,
    beds,
    baths,
    limit = 20,
    offset = 0
} = {}) => {
    const params = new URLSearchParams();

    if (city) params.append('city', city);
    if (zipCode) params.append('zipCode', zipCode);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (beds) params.append('beds', beds);
    if (baths) params.append('baths', baths);
    params.append('limit', limit);
    params.append('offset', offset);

    const response = await fetch(`${URL}?${params.toString()}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
};

// GET /api/client/:id
export const fetchID = async (id) => {
    const response = await fetch(`${URL}/${id}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
    
    return response.json();
}

// GET /api/client/:id/openhouses
export const fetchOH = async (id) => {
    const response = await fetch(`${URL}/${id}/openhouses`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
    
    return response.json();
}