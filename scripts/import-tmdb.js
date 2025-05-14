require('dotenv').config();
const axios = require('axios');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchGenres() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=ru`;
  const res = await axios.get(url);
  return res.data.genres;
}

async function fetchPopularMovies(page = 1) {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=ru&page=${page}`;
  const res = await axios.get(url);
  return res.data.results;
}

async function importData() {
  console.log('🔍 TMDB_API_KEY найден. Начинаем импорт...');

  const db = await mysql.createConnection(dbConfig);
  console.log('✅ Подключение к базе данных успешно.');

  const genres = await fetchGenres();
  let movies = [];

  for (let page = 1; page <= 25; page++) {
  const pageMovies = await fetchPopularMovies(page);
  movies = movies.concat(pageMovies);
}

  // Импорт жанров
  for (const genre of genres) {
    await db.execute(
      'INSERT IGNORE INTO Genres (Genres_id, Name) VALUES (?, ?)',
      [genre.id, genre.name]
    );
  }

  // Импорт фильмов и связей
  for (const movie of movies) {
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : null;

    await db.execute(
      `INSERT INTO Movies
        (Movie_id, Title, Original_title, Description, Release_year, Country, Age_rating, Poster_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          Title = VALUES(Title),
          Original_title = VALUES(Original_title),
          Description = VALUES(Description),
          Release_year = VALUES(Release_year),
          Country = VALUES(Country),
          Age_rating = VALUES(Age_rating),
          Poster_path = VALUES(Poster_path)
      `,
      [
        movie.id,
        movie.title || null,
        movie.original_title || null,
        movie.overview || null,
        releaseYear,
        'USA', // Можно сделать автоматическое определение позже
        'PG-13',
        movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
      ]
    );

    // Связи с жанрами
    for (const genreId of movie.genre_ids || []) {
      await db.execute(
        'INSERT IGNORE INTO Movies_has_Genres (Movies_Movie_id, Genres_Genres_id) VALUES (?, ?)',
        [movie.id, genreId]
      );
    }
  }

  console.log('🎉 Импорт завершён!');
  await db.end();
}

importData().catch((err) => {
  console.error('❌ Ошибка при импорте:');
  console.error(err);
});
