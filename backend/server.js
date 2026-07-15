require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();
const PORT = 5000;

app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });

    next();
});

app.use('/api/properties', require('./routes/properties'));

// health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.status(200).json({ 
            status: "ok",
            database: "connected"
        });
    } catch (error) {
        res.status(500).json({ 
            status: "error",
            database: "failed to connect"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});