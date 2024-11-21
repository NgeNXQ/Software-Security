require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'IP-13-Babich-Denys',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

async function refreshToken(req) {
    const { refresh_token } = req.session.tokens;
    try {
        const response = await axios({
            method: 'post',
            url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                refresh_token: refresh_token,
            }),
        });

        req.session.tokens.access_token = response.data.access_token;
        req.session.tokens.refresh_token = response.data.refresh_token;
        req.session.tokens.expires_in = Date.now() + response.data.expires_in * 1000;
    } catch (error) {
        console.error('Token refresh failed:', error.response?.data || error.message);
        throw new Error('Token refresh failed');
    }
}

app.use(async (req, res, next) => {
    if (req.session.tokens && Date.now() > req.session.tokens.expires_in - 60000) {
        try {
            await refreshToken(req);
        } catch (error) {
            return res.status(401).send('Failed to refresh token');
        }
    }
    next();
});

app.get('/', async (req, res) => {
    if (req.session.tokens) {
        try {
            const { access_token } = req.session.tokens;
            const response = await axios.get(
                `https://${process.env.AUTH0_DOMAIN}/userinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            return res.json({
                user: response.data,
                logout: '/logout',
            });
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            req.session.destroy();
        }
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.post('/api/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const response = await axios({
            method: 'post',
            url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                grant_type: 'password',
                username: login,
                password: password,
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
                scope: 'offline_access openid profile email',
            }),
        });

        req.session.tokens = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: Date.now() + response.data.expires_in * 1000,
        };

        res.json({ success: true, token: response.data.access_token });
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        res.status(401).send('Login failed');
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const response = await axios({
            method: 'post',
            url: `https://${process.env.AUTH0_DOMAIN}/dbconnections/signup`,
            headers: { 'content-type': 'application/json' },
            data: {
                client_id: process.env.AUTH0_CLIENT_ID,
                email,
                username,
                password,
                connection: 'Username-Password-Authentication',
            },
        });
        res.json({ success: true, message: 'User registered successfully.' });
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
        res.status(400).send('Registration failed');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
