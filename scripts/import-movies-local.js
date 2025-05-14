const fs = require('fs');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Tita',
  database: 'movie_web_app',
};

async function importFromJSON() {
  const raw = fs.readFileSync('./movies.json', 'utf-8');
  const { genres, movies } = JSON.parse(raw);
  const db = await mysql.createConnection(dbConfig);
  console.log('✅ Подключение к базе данных успешно.');

  for (const genre of genres) {
    await db.execute(
      'INSERT IGNORE INTO Genres (Genres_id, Name) VALUES (?, ?)',
      [genre.id, genre.name]
    );
  }

  for (const movie of movies) {
    await db.execute(
      `INSERT IGNORE INTO Movies 
      (Movie_id, Title, Description, Release_year, Country, Age_rating, Poster_path)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        movie.id,
        movie.title,
        movie.overview,
        movie.release_date?.split('-')[0],
        'USA',
        'PG-13',
        movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      ]
    );

    for (const genreId of movie.genre_ids) {
      await db.execute(
        `INSERT IGNORE INTO Movies_has_Genres (Movies_Movie_id, Genres_Genres_id)
         VALUES (?, ?)`,
        [movie.id, genreId]
      );
    }
  }

  console.log('🎉 Импорт завершён локально!');
  await db.end();
}

importFromJSON().catch((err) => {
  console.error('❌ Ошибка при импорте из JSON:', err.message);
});
