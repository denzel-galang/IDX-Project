const request = require('supertest');
const express = require('express');
const propertiesRouter = require('../routes/properties');

// Mock the database pool
jest.mock('../db', () => ({
    query: jest.fn()
}));

const db = require('../db');

// Build a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/properties', propertiesRouter);

// Mock Data
const mockProperty = {
    L_ListingID: '123',
    L_Address: '123 Main St',
    L_City: 'Jacksonville',
    L_State: 'FL',
    L_Zip: '32099',
    L_SystemPrice: 350000,
    L_Keyword2: 3,
    LM_Dec_3: 2,
    LM_Int2_3: 1800,
    L_Status: 'Active',
    L_Type_: 'Residential'
};

const mockOpenHouse = {
    id: 1,
    L_ListingID: '123',
    OpenHouseDate: '2024-06-01',
    OH_StartTime: '10:00:00',
    OH_EndTime: '12:00:00'
}; 

// Most listing queries fire two db.query calls: rows + COUNT
const mockListingResponse = (rows, total = rows.length) => {
    db.query
        .mockResolvedValueOnce([rows])           // SELECT rows
        .mockResolvedValueOnce([[{ total }]]);    // SELECT COUNT
};

// GET /api/properties 

describe('GET /api/properties', () => {

    beforeEach(() => jest.resetAllMocks());

    // Success
    it('returns 200 with results and count on success', async () => {
        mockListingResponse([mockProperty]);

        const res = await request(app).get('/api/properties');

        expect(res.status).toBe(200);
        expect(res.body.results).toHaveLength(1);
        expect(res.body.total).toBe(1);
        expect(res.body.limit).toBe(20);
        expect(res.body.offset).toBe(0);
    });

    it('returns an empty results array when no properties match', async () => {
        mockListingResponse([]);

        const res = await request(app).get('/api/properties');

        expect(res.status).toBe(200);
        expect(res.body.results).toHaveLength(0);
        expect(res.body.total).toBe(0);
    });

    // Pagination
    it('applies limit and offset correctly', async () => {
        mockListingResponse([mockProperty], 50);

        const res = await request(app).get('/api/properties?limit=5&offset=10');

        expect(res.status).toBe(200);
        expect(res.body.limit).toBe(5);
        expect(res.body.offset).toBe(10);
    });

    it('returns 400 when limit is 0', async () => {
        const res = await request(app).get('/api/properties?limit=0');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 when limit exceeds 199', async () => {
        const res = await request(app).get('/api/properties?limit=200');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 when limit is a decimal', async () => {
        const res = await request(app).get('/api/properties?limit=2.5');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 when limit is a string', async () => {
        const res = await request(app).get('/api/properties?limit=abc');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 when offset is negative', async () => {
        const res = await request(app).get('/api/properties?offset=-1');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    // Filters — city
    it('filters by city', async () => {
        mockListingResponse([mockProperty]);

        const res = await request(app).get('/api/properties?city=29 Palms');

        expect(res.status).toBe(200);
        const [calledQuery] = db.query.mock.calls[0];
        expect(calledQuery).toContain('L_City');
    });

    // Filters — zipcode
    it('filters by zipcode', async () => {
        mockListingResponse([mockProperty]);

        const res = await request(app).get('/api/properties?zipcode=32099');

        expect(res.status).toBe(200);
        const [calledQuery] = db.query.mock.calls[0];
        expect(calledQuery).toContain('L_Zip');
    });

    it('returns 400 when zipcode is not 5 digits', async () => {
        const res = await request(app).get('/api/properties?zipcode=123');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    // Filters — price
    it('filters by minPrice', async () => {
        mockListingResponse([mockProperty]);

        const res = await request(app).get('/api/properties?minPrice=100000');

        expect(res.status).toBe(200);
        const [calledQuery] = db.query.mock.calls[0];
        expect(calledQuery).toContain('L_SystemPrice >=');
    });

    it('filters by maxPrice', async () => {
        mockListingResponse([mockProperty]);

        const res = await request(app).get('/api/properties?maxPrice=500000');

        expect(res.status).toBe(200);
        const [calledQuery] = db.query.mock.calls[0];
        expect(calledQuery).toContain('L_SystemPrice <=');
    });

    it('filters by minPrice and maxPrice together', async () => {
        mockListingResponse([mockProperty]);

        const res = await request(app)
            .get('/api/properties?minPrice=100000&maxPrice=500000');

        expect(res.status).toBe(200);
    });

    it('returns 400 when minPrice is not a number', async () => {
        const res = await request(app).get('/api/properties?minPrice=abc');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 when maxPrice is less than minPrice', async () => {
        const res = await request(app)
            .get('/api/properties?minPrice=500000&maxPrice=100000');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 when minPrice is negative', async () => {
        const res = await request(app).get('/api/properties?minPrice=-1');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    // Filters — beds
    it('filters by beds', async () => {
        mockListingResponse([mockProperty]);

        const res = await request(app).get('/api/properties?beds=3');

        expect(res.status).toBe(200);
        const [calledQuery] = db.query.mock.calls[0];
        expect(calledQuery).toContain('L_Keyword2');
    });

    it('returns 400 when beds is a decimal', async () => {
        const res = await request(app).get('/api/properties?beds=2.5');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 when beds is a string', async () => {
        const res = await request(app).get('/api/properties?beds=abc');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    // Filters — baths
    it('filters by baths', async () => {
        mockListingResponse([mockProperty]);

        const res = await request(app).get('/api/properties?baths=2');

        expect(res.status).toBe(200);
        const [calledQuery] = db.query.mock.calls[0];
        expect(calledQuery).toContain('LM_Dec_3');
    });

    it('returns 400 when baths is negative', async () => {
        const res = await request(app).get('/api/properties?baths=-1');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    // Combined filters
    it('applies multiple filters together', async () => {
        mockListingResponse([mockProperty]);

        const res = await request(app)
            .get('/api/properties?city=Jacksonville&minPrice=200000&beds=3&baths=2');

        expect(res.status).toBe(200);
        const [calledQuery] = db.query.mock.calls[0];
        expect(calledQuery).toContain('L_City');
        expect(calledQuery).toContain('L_SystemPrice >=');
        expect(calledQuery).toContain('L_Keyword2');
        expect(calledQuery).toContain('LM_Dec_3');
    });

    // Database error
    it('returns 500 when the database throws', async () => {
        db.query.mockRejectedValueOnce(new Error('DB connection lost'));

        const res = await request(app).get('/api/properties');

        expect(res.status).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});

// GET /api/properties/:id
describe('GET /api/properties/:id', () => {

    beforeEach(() => jest.resetAllMocks());

    it('returns 200 with the property on success', async () => {
        db.query
            .mockResolvedValueOnce([[mockProperty]])   // existence check
            .mockResolvedValueOnce([[mockProperty]]);  // full fetch

        const res = await request(app).get('/api/properties/123');

        expect(res.status).toBe(200);
        expect(res.body.L_ListingID).toBe('123');
        expect(res.body.L_Address).toBe('123 Main St');
    });

    it('returns 404 when the property does not exist', async () => {
        db.query.mockResolvedValueOnce([[]]); // existence check returns empty

        const res = await request(app).get('/api/properties/99999');

        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 for a non-numeric ID', async () => {
        const res = await request(app).get('/api/properties/abc');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 for a decimal ID', async () => {
        const res = await request(app).get('/api/properties/1.5');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 for a negative ID', async () => {
        const res = await request(app).get('/api/properties/-1');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns 500 when the database throws', async () => {
        db.query.mockRejectedValueOnce(new Error('DB connection lost'));

        const res = await request(app).get('/api/properties/123');

        expect(res.status).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});

// GET /api/properties/:id/openhouses
describe('GET /api/properties/:id/openhouses', () => {

    beforeEach(() => jest.resetAllMocks());

    it('returns 200 with open houses for a valid property', async () => {
        db.query
            .mockResolvedValueOnce([[mockProperty]])    // property exists
            .mockResolvedValueOnce([[mockOpenHouse]]);  // open houses

        const res = await request(app).get('/api/properties/123/openhouses');

        expect(res.status).toBe(200);
        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0].OpenHouseDate).toBe('2024-06-01');
    });

    it('returns 200 with empty results when no open houses are scheduled', async () => {
        db.query
            .mockResolvedValueOnce([[mockProperty]])  // property exists
            .mockResolvedValueOnce([[]]);             // no open houses

        const res = await request(app).get('/api/properties/123/openhouses');

        expect(res.status).toBe(200);
        expect(res.body.results).toHaveLength(0);
    });

    it('returns 404 when the property does not exist', async () => {
        db.query.mockResolvedValueOnce([[]]); // property not found

        const res = await request(app).get('/api/properties/99/openhouses');

        expect(res.status).toBe(404);
        expect(res.body.error).toBeDefined();
    });

    it('returns 400 for a non-numeric ID', async () => {
        const res = await request(app).get('/api/properties/abc/openhouses');
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('returns open houses ordered by date and start time', async () => {
        const earlierOpenHouse = { ...mockOpenHouse, OpenHouseDate: '2024-05-01', OH_StartTime: '09:00:00' };
        const laterOpenHouse = { ...mockOpenHouse, OpenHouseDate: '2024-06-01', OH_StartTime: '10:00:00' };

        db.query
            .mockResolvedValueOnce([[mockProperty]])
            .mockResolvedValueOnce([[earlierOpenHouse, laterOpenHouse]]);

        const res = await request(app).get('/api/properties/123/openhouses');

        expect(res.status).toBe(200);
        expect(res.body.results[0].OpenHouseDate).toBe('2024-05-01');
        expect(res.body.results[1].OpenHouseDate).toBe('2024-06-01');
    });

    it('returns 500 when the database throws', async () => {
        db.query.mockRejectedValueOnce(new Error('DB connection lost'));

        const res = await request(app).get('/api/properties/123/openhouses');

        expect(res.status).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});