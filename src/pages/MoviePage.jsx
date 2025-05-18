import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './MoviePage.css';

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch(() => setMovie(null));
  }, [id]);

  if (!movie) return <p style={{ color: 'white', textAlign: 'center' }}>Загрузка фильма...</p>;

  return (
    <div className="movie-page-container">
      <div className="movie-card-detailed">
        <img className="movie-poster" src={movie.Poster_path} alt={movie.Title} />

        <div className="movie-info">
          <h1>{movie.Title} ({movie.Release_year})</h1>
          {movie.Original_title && <p><strong>Оригинальное название:</strong> {movie.Original_title}</p>}
          <p><strong>Жанр:</strong> {movie.genres || '—'}</p>
          <p><strong>Страна:</strong> {movie.Country || '—'}</p>
          <p><strong>Режиссёр(ы):</strong> {movie.directors || '—'}</p>
          <p><strong>Актёры:</strong> {movie.actors || '—'}</p>
          <p><strong>Описание:</strong> {movie.Description || 'Описание отсутствует.'}</p>

          <Link className="back-button" to="/">← Назад к списку фильмов</Link>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
