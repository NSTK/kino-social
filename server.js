// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log('🔍 DB CONFIG:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Регистрация пользователя
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  const sql = `
    INSERT INTO User (Name, Email, Password, Registration_date, Admin_Admin_id)
    VALUES (?, ?, ?, NOW(), 1)
  `;

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error('❌ Ошибка регистрации:', err);
      return res.status(500).json({ error: 'Ошибка при регистрации' });
    }
    res.status(200).json({ message: 'Пользователь зарегистрирован' });
  });
});

// ✅ Вход пользователя
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM User WHERE Email = ? AND Password = ?';

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('❌ Ошибка при входе:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Вход выполнен успешно', user: results[0] });
    } else {
      res.status(401).json({ error: 'Неверные данные' });
    }
  });
});

// ✅ Получение фильмов с фильтрацией
app.get('/api/movies', (req, res) => {
  const limit = parseInt(req.query.limit) || 15;
  const filter = req.query.filter || null;

  let filterCondition = '';
  if (filter === 'classic') {
    filterCondition = 'AND m.Release_year <= 2000';
  } else if (filter === 'new') {
    filterCondition = 'AND m.Release_year >= 2025';
  }

  const sql = `
    SELECT m.*, GROUP_CONCAT(g.Name SEPARATOR ', ') AS genres
    FROM Movies m
    LEFT JOIN Movies_has_Genres mg ON m.Movie_id = mg.Movies_Movie_id
    LEFT JOIN Genres g ON mg.Genres_Genres_id = g.Genres_id
    WHERE m.Release_year IS NOT NULL ${filterCondition}
    GROUP BY m.Movie_id
    ORDER BY m.Release_year ASC
    LIMIT ${mysql.escape(limit)}
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Ошибка при получении фильмов:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json(results);
  });
});

// ✅ Получение всех жанров
app.get('/api/genres', (req, res) => {
  const sql = 'SELECT * FROM Genres ORDER BY Name';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Ошибка при получении жанров:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json(results);
  });
});

// ✅ Получение всех пользователей
app.get('/api/users', (req, res) => {
  const sql = 'SELECT User_id, Name FROM User';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Ошибка при получении пользователей:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json(results);
  });
});

// ✅ Получение друзей пользователя (Friendship)
app.get('/api/friends', (req, res) => {
  const currentUserId = parseInt(req.query.currentUserId);

  const sql = `
    SELECT u.User_id, u.Name
    FROM User u
    JOIN Friendship f
      ON (f.User_id_1 = ? AND f.User_id_2 = u.User_id)
      OR (f.User_id_2 = ? AND f.User_id_1 = u.User_id)
    WHERE f.Status = 'accepted'
  `;

  db.query(sql, [currentUserId, currentUserId], (err, results) => {
    if (err) {
      console.error('❌ Ошибка при получении друзей:', err);
      return res.status(500).json({ error: 'Ошибка при получении друзей' });
    }
    res.json(results);
  });
});

// ✅ Добавление друга (Friendship)
app.post('/api/friends', (req, res) => {
  const { currentUserId, friendId } = req.body;

  if (!currentUserId || !friendId) {
    return res.status(400).json({ error: 'Отсутствуют данные' });
  }

  const sql = `
    INSERT INTO Friendship (User_id_1, User_id_2, Status, Created_at)
    VALUES (?, ?, 'accepted', NOW())
  `;

  db.query(sql, [currentUserId, friendId], (err, result) => {
    if (err) {
      console.error('❌ Ошибка при добавлении в друзья:', err);
      return res.status(500).json({ error: 'Ошибка при добавлении в друзья' });
    }
    res.status(200).json({ message: 'Друг добавлен' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
