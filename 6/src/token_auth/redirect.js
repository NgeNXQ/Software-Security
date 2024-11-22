const express = require('express');
const session = require('express-session');  // Import session middleware
const app = express();

// Set up session middleware
app.use(session({
  secret: 'umMFiGfBGCMjywkI-qpg_vRUn8E3sEUaW6I65j58P2lSlymqfmT3gq1k5l7HFDO_', // Use a secure secret key
  resave: false,
  saveUninitialized: true
}));

const requireAuth = (req, res, next) => {
  if (!req.session.access_token) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  next();
};

// Маршрут для редіректу на сторінку логіну
app.get('/login', (req, res) => {
  const authDomain = 'https://dev-hfzb6seuth5jesyp.eu.auth0.com/authorize';
  const clientId = 'q0SmG7tFBJlJIYxZ5NDhaz1umungwOAZ';
  const redirectUri = 'http://localhost:3000/callback';
  const responseType = 'code';
  const responseMode = 'query';

  // Створення URL для редіректу
  const loginUrl = `${authDomain}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&response_mode=${responseMode}`;

  // Редірект на Auth0
  res.redirect(loginUrl);
});

// Обробка callback після логіну
app.get('/callback', (req, res) => {
  // Тут оброблятиметься відповідь з кодом авторизації
  const code = req.query.code;
  if (code) {
    res.send(`Authorization code: ${code}`);
    // Далі тут можна отримати access token через бекенд
  } else {
    res.send('Authorization code not found');
  }
});

app.get('/profile', requireAuth, (req, res) => {
  res.json({ message: 'This is your profile data', accessToken: req.session.access_token });
});

// Публічний маршрут
app.get('/public', (req, res) => {
  res.json({ message: 'This is a public route accessible to anyone.' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
