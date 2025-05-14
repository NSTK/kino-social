const mysql = require('mysql2/promise');

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Tita',
  database: 'movie_web_app'
};

async function insertGenres() {
  const db = await mysql.createConnection(dbConfig);

  for (const genre of genres) {
    await db.execute(
      'INSERT IGNORE INTO Genres (Genres_id, Name) VALUES (?, ?)',
      [genre.id, genre.name]
    );
    console.log(`✅ Добавлен жанр: ${genre.name}`);
  }

  console.log('🎉 Импорт жанров завершён!');
  await db.end();
}

insertGenres().catch(err => {
  console.error('❌ Ошибка при импорте жанров:', err.message);
});
