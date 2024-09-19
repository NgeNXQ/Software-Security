const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const JWT_SECRET_KEY = 'NUKE';
const JWT_EXPIRATION = '30s';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'Username1',
    }
]

app.use((req, res, next) => {
    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is invalid or expired' });
            }
            req.user = decoded;
            next();
        });
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    if (req.user) {
        return res.json({
            username: req.user.username,
            logout: 'http://localhost:3000/logout'
        });
    }
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find((user) => {
        return user.login === login && user.password === password;
    });

    if (user) {
        const token = jwt.sign({ username: user.username }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION });
        res.json({ token });
    } else {
        res.status(401).send();
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});