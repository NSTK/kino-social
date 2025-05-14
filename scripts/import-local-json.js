require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Путь к JSON-файлу
const jsonPath = path.join(__dirname, 'movies_data_extended.json');

// Конфиг базы данных
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function importFromJson() {
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const { movies, genres } = JSON.parse(rawData);

  const db = await mysql.createConnection(dbConfig);
  console.log('✅ Подключение к БД успешно');

  // Импорт жанров
  for (const genre of genres) {
    await db.execute(
      'INSERT IGNORE INTO Genres (Genres_id, Name) VALUES (?, ?)',
      [genre.id, genre.name]
    );
  }

  // Импорт фильмов и связей с жанрами
  for (const movie of movies) {
    await db.execute(
      `INSERT IGNORE INTO Movies 
       (Movie_id, Title, Description, Release_year, Country, Age_rating, Poster_path)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        movie.id,
        movie.title,
        movie.description,
        movie.release_year,
        movie.country,
        movie.age_rating,
        movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      ]
    );

    for (const genreId of movie.genre_ids) {
      await db.execute(
        'INSERT IGNORE INTO Movies_has_Genres (Movies_Movie_id, Genres_Genres_id) VALUES (?, ?)',
        [movie.id, genreId]
      );
    }
  }

  await db.end();
  console.log('🎉 Импорт из JSON завершён!');
}

importFromJson().catch((err) => {
  console.error('❌ Ошибка при импорте из JSON:\n', err);
});
