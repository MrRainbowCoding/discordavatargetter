const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const app = express();

const redirectUri = 'https://discordavatargetter.vercel.app/authorize'; // Updated redirect URI
const scopes = ['identify'];

app.get('/', (req, res) => {
    const authorizeUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes.join('%20')}`;

    res.redirect(authorizeUrl);
});

app.get('/authorize', async(req, res) => {
    try {
        const code = req.query.code;
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                scope: scopes.join(' '),
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

        const tokenData = tokenResponse.data;

        const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = userResponse.data;

        const avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;

        // Redirect to /api/authorize endpoint with avatar URL as a query parameter
        res.redirect(`/api/authorize?avatarUrl=${avatarUrl}`);
    } catch (error) {
        console.error('Error:', error);
        res.send('An error occurred. Please check the console.');
    }
});

app.get('/api/authorize', (req, res) => {
    const avatarUrl = req.query.avatarUrl;

    // Display the avatar URL
    res.send(`<img src="${avatarUrl}" alt="Discord Avatar">`);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});