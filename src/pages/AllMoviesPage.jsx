import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllMoviesPage.css';
import { FaFilm } from 'react-icons/fa';

const AllMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [genreFilter, setGenreFilter] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/movies?limit=60');
        setMovies(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке фильмов:', err);
      }
    };

    fetchMovies();
  }, []);

  const containsNonLatin = (text) => /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/.test(text);

  const filteredMovies = genreFilter
    ? movies.filter(
        (movie) =>
          movie.genres &&
          movie.genres.toLowerCase().includes(genreFilter.toLowerCase()) &&
          !containsNonLatin(movie.Title)
      )
    : movies.filter((movie) => !containsNonLatin(movie.Title));

  return (
    <div className="all-movies-page">
      <h2><FaFilm /> Фильмы</h2>
      <div className="filter-bar">
        <label htmlFor="genre-select">Жанр:</label>
        <select
          id="genre-select"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="genre-select"
        >
          <option value="">Все жанры</option>
          <option value="боевик">Боевик</option>
          <option value="вестерн">Вестерн</option>
          <option value="военный">Военный</option>
          <option value="детектив">Детектив</option>
          <option value="документальный">Документальный</option>
          <option value="драма">Драма</option>
          <option value="история">История</option>
          <option value="комедия">Комедия</option>
          <option value="криминал">Криминал</option>
          <option value="мелодрама">Мелодрама</option>
          <option value="музыка">Музыка</option>
          <option value="мультфильм">Мультфильм</option>
          <option value="приключения">Приключения</option>
          <option value="семейный">Семейный</option>
          <option value="телевизионный фильм">Телевизионный фильм</option>
          <option value="триллер">Триллер</option>
          <option value="ужасы">Ужасы</option>
          <option value="фантастика">Фантастика</option>
          <option value="фэнтези">Фэнтези</option>
        </select>
      </div>
      <div className="movies-grid">
        {filteredMovies.map((movie) => (
          <div className="movie-card" key={movie.Movie_id}>
            <img src={movie.Poster_path} alt={movie.Title} />
            <h3>{movie.Title}</h3>
            <p>{movie.Release_year}</p>
            <p>{movie.genres}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMoviesPage;
