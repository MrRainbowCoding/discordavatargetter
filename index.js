const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const app = express();

const redirectUri = 'https://discordavatargetter.vercel.app/authorize';
const scopes = ['identify'];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Serve the HTML file
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
            }
        );

        const tokenData = tokenResponse.data;

        const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = userResponse.data;

        const avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;

        res.send(`<img src="${avatarUrl}" alt="Discord Avatar">`);
    } catch (error) {
        console.error('Error:', error);
        res.send('An error occurred. Please check the console.');
    }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});