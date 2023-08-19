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

app.get('/api/authorize', async(req, res) => {
    try {
        // Retrieve the authorization code from the request query parameters
        const code = req.query.code;

        // Exchange the authorization code for an access token
        const params = new URLSearchParams();
        params.append('client_id', process.env.CLIENT_ID); // Replace with your Discord app's client ID
        params.append('client_secret', process.env.CLIENT_SECRET); // Replace with your Discord app's client secret
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', redirectUri);
        params.append('scope', scopes.join(' '));

        const response = await axios.post('https://discord.com/api/v8/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Extract the access token from the response
        const accessToken = response.data.access_token;

        // Fetch the user's profile using the access token
        const profileResponse = await axios.get('https://discord.com/api/v8/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Extract the user's ID from the profile response
        const userId = profileResponse.data.id;

        // Retrieve the user's avatar URL
        const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${profileResponse.data.avatar}.png`;

        res.send(avatarUrl);
    } catch (error) {
        console.error('Error fetching avatar URL:', error);
        res.status(500).send('An error occurred while fetching the avatar URL.');
    }
});

app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running');
});