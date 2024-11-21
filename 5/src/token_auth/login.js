// Імпортуємо необхідні бібліотеки
const express = require('express');
const jwt = require('jsonwebtoken'); // Для створення токенів JWT
const session = require('express-session'); // Для управління сесіями
const bodyParser = require('body-parser'); // Для парсингу тіла запитів

// Створюємо додаток Express
const app = express();

// Налаштовуємо парсер JSON
app.use(bodyParser.json());

// Налаштовуємо сесії
app.use(
  session({
    secret: 'BABICH_KEY', // Секрет для сесій
    resave: false,
    saveUninitialized: true,
  })
);

// Приклад масиву користувачів
const users = [
  { login: 'user1', password: 'password1', username: 'User One' },
  { login: 'Login', password: 'Password', username: 'User Two' },
];

// POST-запит на авторизацію
app.post('/api/login', (req, res) => {
  const { login, password } = req.body;

  // Знаходимо користувача в масиві
  const user = users.find(
    (user) => user.login === login && user.password === password
  );

  if (user) {
    // Зберігаємо дані в сесії
    req.session.username = user.username;
    req.session.login = user.login;

    // Створюємо JWT токен
    const token = jwt.sign(
      { username: user.username },
      'umMFiGfBGCMjywkI-qpg_vRUn8E3sEUaW6I65j58P2lSlymqfmT3gq1k5l7HFDO_', // Секретний ключ
      { expiresIn: '1h' } // Час дії токена
    );

    // Повертаємо токен
    return res.json({ token });
  } else {
    // Відповідаємо статусом 401, якщо авторизація не вдалася
    return res.status(401).send('Unauthorized');
  }
});

// Запускаємо сервер
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
