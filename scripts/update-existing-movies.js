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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCredits(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=ru`;
  const res = await axios.get(url);
  return res.data;
}

async function fetchDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ru`;
  const res = await axios.get(url);
  return res.data;
}

async function fetchAgeRating(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${TMDB_API_KEY}`;
  const res = await axios.get(url);
  const ruRelease = res.data.results.find(r => r.iso_3166_1 === 'RU');
  if (ruRelease && ruRelease.release_dates.length > 0) {
    return ruRelease.release_dates[0].certification || 'N/A';
  }
  return 'N/A';
}

async function updateExistingMovies() {
  const db = await mysql.createConnection(dbConfig);
  console.log('✅ Подключено к базе данных');

  const [movies] = await db.query('SELECT Movie_id FROM Movies WHERE Updated = false');
  console.log(`🔍 Найдено фильмов для обновления: ${movies.length}`);

  for (const { Movie_id } of movies) {
    try {
      const details = await fetchDetails(Movie_id);
      const credits = await fetchCredits(Movie_id);
      const ageRating = await fetchAgeRating(Movie_id);
      const country = details.production_countries?.[0]?.name || 'N/A';
      const poster = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null;

      // Обновляем Movie
      await db.execute(
        `UPDATE Movies SET
          Country = ?,
          Age_rating = ?,
          Poster_path = ?,
          Updated = true
        WHERE Movie_id = ?`,
        [country, ageRating, poster, Movie_id]
      );

      // Режиссёры
      const directors = credits.crew.filter(p => p.job === 'Director');
      for (const d of directors) {
        await db.execute(
          'INSERT IGNORE INTO Directors (Directors_id, Name) VALUES (?, ?)',
          [d.id, d.name]
        );
        await db.execute(
          'INSERT IGNORE INTO Movies_has_Directors (Movies_Movie_id, Directors_Directors_id) VALUES (?, ?)',
          [Movie_id, d.id]
        );
      }

      // Актёры
      const actors = credits.cast.slice(0, 5);
      for (const a of actors) {
        const profileUrl = a.profile_path
          ? `https://image.tmdb.org/t/p/w500${a.profile_path}`
          : null;

        await db.execute(
          'INSERT IGNORE INTO Actors (Actor_id, Name, Profile_path) VALUES (?, ?, ?)',
          [a.id, a.name, profileUrl]
        );
        await db.execute(
          'INSERT IGNORE INTO Movies_has_Actors (Movies_Movie_id, Actors_Actor_id) VALUES (?, ?)',
          [Movie_id, a.id]
        );
      }

      console.log(`✅ Обновлён фильм: ${Movie_id}`);
    } catch (err) {
      console.warn(`⚠️ Пропущен Movie_id ${Movie_id}:`, err);
    }

    await delay(1000); // 1 секунда между запросами
  }

  await db.end();
  console.log('🎉 Обновление завершено!');
}

updateExistingMovies().catch((err) => {
  console.error('❌ Ошибка при запуске скрипта:');
  console.error(err);
});
