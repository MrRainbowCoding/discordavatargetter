const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const app = express();

const redirectUri = 'https://discordavatargetter.vercel.app/authorize';
const scopes = ['identify'];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Serve the index.html file
});

app.get('/authorize', async(req, res) => {
    res.sendFile(__dirname + '/authorize.html'); // Serve the authorize.html file
});

app.get('/getAvatarUrl', async(req, res) => {
    try {
        // Fetch the user's avatar URL based on the authorization code
        const code = req.query.code;
        // Rest of your code to fetch the avatar URL
        // For demonstration purposes, let's assume avatarUrl is a variable containing the URL
        const avatarUrl = `https://cdn.discordapp.com/avatars/user_id/avatar.png`;

        res.send(avatarUrl);
    } catch (error) {
        console.error('Error fetching avatar URL:', error);
        res.status(500).send('An error occurred while fetching the avatar URL.');
    }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});