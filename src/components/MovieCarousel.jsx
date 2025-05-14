import React, { useEffect, useState } from 'react';
import './MovieCarousel.css';
import axios from 'axios';

const MovieCarousel = ({ filter, limit = 15, title }) => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const query = filter ? `?filter=${filter}&limit=${limit}` : `?limit=${limit}`;
    axios.get(`http://localhost:3001/api/movies${query}`)
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке фильмов:', error);
      });
  }, [filter, limit]);

  if (movies.length === 0) {
    return <p>Загрузка фильмов...</p>;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="movie-carousel">
      <div className="carousel-card">
        <img
          className="poster"
          src={currentMovie.Poster_path || '/images/placeholder.jpg'}
          alt={currentMovie.Title}
        />
        <div className="movie-info">
          <h3>{currentMovie.Title}</h3>
          <p>{currentMovie.Description}</p>
          <p><strong>Год:</strong> {currentMovie.Release_year || 'неизвестен'}</p>
          <p><strong>Жанры:</strong> {Array.isArray(currentMovie.genres) ? currentMovie.genres.join(', ') : currentMovie.genres || 'не указаны'}</p>
        </div>
      </div>
      <div className="controls">
        <button onClick={() => setCurrentIndex((currentIndex - 1 + movies.length) % movies.length)}>◀</button>
        <button onClick={() => setCurrentIndex((currentIndex + 1) % movies.length)}>▶</button>
      </div>
    </div>
  );
};

export default MovieCarousel;
