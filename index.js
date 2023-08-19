const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const app = express();

const redirectUri = 'https://discordavatargetter.vercel.app/api/authorize'; // Replace with your Vercel app URL
const scopes = ['identify'];

// Serve static files from the 'public' directory
app.use(express.static('public'));

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

app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running');
});