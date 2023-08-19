const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const redirectUri = 'http://discordavatargetter.vercel.app/api/authorize'; // Updated redirect URI
const scopes = ['identify'];

app.get('/', (req, res) => {
    const authorizeUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes.join('%20')}`;

    res.redirect(authorizeUrl);
});

app.get('/authorize', async(req, res) => {
    try {
        const code = req.query.code;
        // Rest of your code for fetching and displaying the avatar
    } catch (error) {
        console.error('Error:', error);
        res.send('An error occurred. Please check the console.');
    }
});

module.exports = app;