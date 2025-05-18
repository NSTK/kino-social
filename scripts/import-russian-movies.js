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

async function fetchRussianMovies(page = 1) {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=ru&region=RU&with_original_language=ru&with_release_type=3&page=${page}&sort_by=popularity.desc`;
  const res = await axios.get(url);
  return res.data.results;
}

async function fetchGenres() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=ru`;
  const res = await axios.get(url);
  return res.data.genres;
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

async function importRussianMovies() {
  const db = await mysql.createConnection(dbConfig);
  console.log('✅ Подключено к базе данных');

  const genres = await fetchGenres();
  for (const genre of genres) {
    await db.execute(
      'INSERT IGNORE INTO Genres (Genres_id, Name) VALUES (?, ?)',
      [genre.id, genre.name]
    );
  }

  const pagesToFetch = 5; // ~100 фильмов
  for (let page = 1; page <= pagesToFetch; page++) {
    const movies = await fetchRussianMovies(page);

    for (const movie of movies) {
      try {
        const movieId = movie.id;

        const [exists] = await db.query('SELECT 1 FROM Movies WHERE Movie_id = ?', [movieId]);
        if (exists.length > 0) {
          console.log(`⏭ Уже в базе: ${movie.title}`);
          continue;
        }

        const details = await fetchDetails(movieId);
        const credits = await fetchCredits(movieId);
        const ageRating = await fetchAgeRating(movieId);
        const releaseYear = movie.release_date?.split('-')[0] || null;
        const country = details.production_countries?.[0]?.name || 'Россия';
        const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;

        await db.execute(
          `INSERT INTO Movies
            (Movie_id, Title, Original_title, Description, Release_year, Country, Age_rating, Poster_path, Updated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, true)`,
          [
            movieId,
            movie.title || null,
            movie.original_title || null,
            movie.overview || null,
            releaseYear,
            country,
            ageRating,
            poster
          ]
        );

        for (const genreId of movie.genre_ids || []) {
          await db.execute(
            'INSERT IGNORE INTO Movies_has_Genres (Movies_Movie_id, Genres_Genres_id) VALUES (?, ?)',
            [movieId, genreId]
          );
        }

        // Режиссёры
        const directors = credits.crew.filter(p => p.job === 'Director');
        for (const d of directors) {
          await db.execute(
            'INSERT IGNORE INTO Directors (Directors_id, Name) VALUES (?, ?)',
            [d.id, d.name]
          );
          await db.execute(
            'INSERT IGNORE INTO Movies_has_Directors (Movies_Movie_id, Directors_Directors_id) VALUES (?, ?)',
            [movieId, d.id]
          );
        }

        // Актёры (топ-5)
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
            [movieId, a.id]
          );
        }

        console.log(`✅ Добавлен фильм: ${movie.title}`);
      } catch (err) {
        console.warn(`⚠️ Пропущен фильм ${movie.title || movie.id}:`, err.message);
      }

      await delay(1000);
    }
  }

  await db.end();
  console.log('🎉 Импорт российских фильмов завершён!');
}

importRussianMovies().catch((err) => {
  console.error('❌ Ошибка при запуске скрипта:');
  console.error(err);
});
