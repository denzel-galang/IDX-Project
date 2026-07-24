import { fetchProperties, fetchID, fetchOH } from './client';

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('fetchProperties', () => {
    it('returns data on successful response,', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ results: [], count: 0})
        });

        const data = await fetchProperties({ city: '29 Palms', limit: 20, offset: 0 });
        expect(data).toEqual({ results: [], count: 0 });
    });

    it('builds query string correctly from filters', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ results: [], count: 0})
        });

        await fetchProperties({ city: 'Tijuana', minPrice: 100000, beds: 3 });
        const calledUrl = global.fetch.mock.calls[0][0];

        expect(calledUrl).toContain('city=Tijuana');
        expect(calledUrl).toContain('minPrice=100000');
        expect(calledUrl).toContain('beds=3');
    });

    it('throws error message returned from server on HTTP error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'An error occurred.' })
        });

        await expect(fetchProperties()).rejects.toThrow('An error occurred.');
    });
});

describe('fetchID', () => {
    it('returns a single property on successful response', async () => {
        const mockProperty = { L_ListingID: '123', city: '29 Palms' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockProperty
        });

        const data = await fetchID(123);
        expect(data).toEqual(mockProperty);
    });

    it('calls correct URL with given ID', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
        });

        await fetchID(123);
        expect(global.fetch.mock.calls[0][0]).toContain('/api/properties/123');
    });

    it('throws 404 for non-existent property', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Property not found.' })
        });

        await expect(fetchID(99999999)).rejects.toThrow('Property not found.');
    });
});

describe('fetchOH', () => {
    it('returns open houses on successful response', async () => {
        const mockOpenHouses = { results: [], total: 0 };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockOpenHouses
        });

        const data = await fetchOH(123);
        expect(data).toEqual(mockOpenHouses);
    });

    it('calls correct URL with given ID', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
        });

        await fetchOH(123);
        expect(global.fetch.mock.calls[0][0]).toContain('/api/properties/123/openhouses');
    });

    it('throws error for non-existent property', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Property not found.' })
        });

        await expect(fetchOH(99999999)).rejects.toThrow('Property not found.');
    });
});