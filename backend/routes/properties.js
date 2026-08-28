const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/properties
router.get('/', async (req, res) => {
    try {
        // retrieve limit and offset from query parameters
        const limitInput = req.query.limit;
        const offsetInput = req.query.offset;

        // use regex to validate input and offset
        if (limitInput !== undefined) {
            if (!/^\d+$/.test(limitInput)) {
                return res.status(400).json({ error: 'Limit must be a positive integer.' });
            }
        }

        if (offsetInput !== undefined) {
            if (!/^\d+$/.test(offsetInput)) {
                return res.status(400).json({ error: 'Offset must be a non-negative integer.' });
            }
        }

        // defining default values for limit and offset
        const limit = limitInput !== undefined ? parseInt(limitInput) : 20;
        const offset = offsetInput !== undefined ? parseInt(offsetInput) : 0;

        const { city, zipcode, minPrice, maxPrice, beds, baths } = req.query; // filter keywords
        
        if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
            return res.status(400).json({ error: 'Limit and offset must be integers.' });
        }

        if (limit < 1 || limit > 100 || offset < 0) {
            return res.status(400).json({ error: 'Limit must be between 1 and 100, and offset cannot be negative.' });
        }

        const filters = [];
        const values = [];

        if (city) {
            filters.push('LOWER(TRIM(L_City)) = LOWER(TRIM(?))');
            values.push(city);
        }

        if (zipcode) {
            if (!/^\d{5}$/.test(zipcode)) {
                return res.status(400).json({ error: 'zipcode must be 5 digits.'});
            }

            filters.push('L_Zip = ?');
            values.push(zipcode);
        }

        if (minPrice) {
            if (isNaN(minPrice) || minPrice < 0) {
                return res.status(400).json({ error: 'minPrice must be a number.' });
            }

            filters.push('L_SystemPrice >= ?');
            values.push(parseFloat(minPrice));
        }

        if (maxPrice) {
            if (isNaN(maxPrice) || maxPrice < 0) {
                return res.status(400).json({ error: 'maxPrice must be a number.' });
            }

            if (minPrice && parseFloat(maxPrice) < parseFloat(minPrice)) {
                return res.status(400).json({ error: 'maxPrice cannot be less than minPrice.' });
            }

            filters.push('L_SystemPrice <= ?');
            values.push(parseFloat(maxPrice));
        }

        if (beds) {
            if (!Number.isInteger(parseFloat(beds)) || parseInt(beds) < 0) {
                return res.status(400).json({ error: 'beds must be a non-negative integer.' });
            }

            filters.push('L_Keyword2 >= ?');
            values.push(parseFloat(beds));
        }

        if (baths) {
            if (!Number.isInteger(parseFloat(baths)) || parseInt(baths) < 0) {
                return res.status(400).json({ error: 'baths must be a non-negative integer.' });
            }

            filters.push('LM_Dec_3 >= ?');
            values.push(parseFloat(baths));
        }

        // construct the query
        const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
        const query = `
            SELECT *
            FROM rets_property ${whereClause} 
            LIMIT ? 
            OFFSET ?
        `;
        values.push(limit, offset);

        // execute the query
        const [rows] = await db.query(query, values);
        const [[{ total }]] = await db.query(
            `SELECT COUNT(*) as total FROM rets_property ${whereClause}`,
            values.slice(0, -2)
        );

        // return the results
        res.json({
            total,
            limit,
            offset,
            results: rows
        });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.get('/:id/openhouses', async (req, res) => {
    try {
        const { id } = req.params;

        // validate ID
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'ID must be a positive integer.' });
        }

        if (parseInt(id) > 2147483647) {
            return res.status(400).json({ error: 'Invalid ID.' });
        }

        // search for the property
        const [rows] = await db.query(
            'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?', 
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Property not found. Please double-check ID number.' });
        }
        
        // return open house information if found, empty array otherwise
        const [openHouses] = await db.query(
            'SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate ASC, OH_StartTime ASC', 
            [id]
        );
        res.json({ results: openHouses });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // validate ID
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'ID must be a positive integer.' });
        }

        if (parseInt(id) > 2147483647) {
            return res.status(400).json({ error: 'Invalid ID.' });
        }

        // search for the property
        const [rows] = await db.query(
            'SELECT * FROM rets_property WHERE L_ListingID = ?', 
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Property not found. Please double-check ID number.' });
        }

        res.json(rows[0]); // return result
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while fetching the property.'
        });
    }
});

module.exports = router;