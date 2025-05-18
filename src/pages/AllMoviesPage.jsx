import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllMoviesPage.css';
import { FaFilm } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const countryNames = {
  'United States of America': 'США',
  'Russia': 'Россия',
  'Soviet Union': 'СССР',
  'United Kingdom': 'Великобритания',
  'Germany': 'Германия',
  'France': 'Франция',
  'Italy': 'Италия',
  'Japan': 'Япония',
  'New Zealand': 'Новая Зеландия',
  'Australia': 'Австралия',
  'South Korea': 'Южная Корея',
  'China': 'Китай',
  'Spain': 'Испания',
  'Belarus': 'Беларусь',
  'Greece': 'Греция',
  'Hong Kong': 'Гонконг',
  'Canada': 'Канада',
  'Belgium': 'Бельгия',
  'South Africa': 'ЮАР',
  'Poland': 'Польша',
  'Vietnam': 'Вьетнам',
  'Denmark': 'Дания',
  'Serbia': 'Сербия',
  'Estonia': 'Эстония',
  'St. Kitts and Nevis': 'Сент-Китс и Невис',
  'India': 'Индия',
  'Latvia': 'Латвия',
  'Bulgaria': 'Болгария',
  'Ireland': 'Ирландия',
  'Argentina': 'Аргентина',
  'Finland': 'Финляндия',
  'Sweden': 'Швеция',
  'Mexico': 'Мексика',
  'Mongolia': 'Монголия',
  'Colombia': 'Колумбия',
  'N/A': 'Неизвестно'
};

const AllMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [genreFilter, setGenreFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [directorFilter, setDirectorFilter] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/movies?limit=0');
        setMovies(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке фильмов:', err);
      }
    };

    const fetchDirectors = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/directors');
        setDirectors(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке режиссёров:', err);
      }
    };

    fetchMovies();
    fetchDirectors();
  }, []);

  const containsNonLatin = (text) =>
    /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/.test(text);

  const uniqueCountries = Array.from(
    new Set(movies.map((movie) => movie.Country).filter(Boolean))
  );

  const filteredMovies = movies.filter((movie) => {
    const matchesGenre = genreFilter
      ? movie.genres && movie.genres.toLowerCase().includes(genreFilter.toLowerCase())
      : true;

    const matchesYear = yearFilter
      ? movie.Release_year && movie.Release_year.toString() === yearFilter
      : true;

    const matchesCountry = countryFilter
      ? movie.Country && movie.Country.toLowerCase() === countryFilter.toLowerCase()
      : true;

    const matchesDirector = directorFilter
      ? movie.directors && movie.directors.toLowerCase().includes(directorFilter.toLowerCase())
      : true;

    return matchesGenre && matchesYear && matchesCountry && matchesDirector && !containsNonLatin(movie.Title);
  });

  return (
    <div className="all-movies-page">
      <h2><FaFilm /> Фильмы</h2>
      <div className="filter-bar">
        {/* Селекторы: жанр, год, страна, режиссёр */}
        {/* ... как раньше ... */}
        <label htmlFor="genre-select">Жанр:</label>
        <select
          id="genre-select"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="genre-select"
        >
          <option value="">Все жанры</option>
          <option value="боевик">Боевик</option>
          <option value="драма">Драма</option>
          <option value="комедия">Комедия</option>
          <option value="фантастика">Фантастика</option>
          <option value="мелодрама">Мелодрама</option>
          <option value="ужасы">Ужасы</option>
          <option value="приключения">Приключения</option>
          <option value="криминал">Криминал</option>
          <option value="история">История</option>
        </select>

        <label htmlFor="year-input">Год:</label>
        <input
          type="number"
          id="year-input"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          placeholder="например, 2020"
          className="year-input"
        />

        <label htmlFor="country-select">Страна:</label>
        <select
          id="country-select"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="genre-select"
        >
          <option value="">Все страны</option>
          {uniqueCountries.map((country) => (
            <option key={country} value={country}>
              {countryNames[country] || country}
            </option>
          ))}
        </select>

        <label htmlFor="director-select">Режиссёр:</label>
        <select
          id="director-select"
          value={directorFilter}
          onChange={(e) => setDirectorFilter(e.target.value)}
          className="genre-select"
        >
          <option value="">Все режиссёры</option>
          {directors.map((d) => (
            <option key={d.Directors_id} value={d.Name}>
              {d.Name}
            </option>
          ))}
        </select>

        <button
          className="reset-button"
          onClick={() => {
            setGenreFilter('');
            setYearFilter('');
            setCountryFilter('');
            setDirectorFilter('');
          }}
        >
          Сбросить фильтры
        </button>
      </div>

      <div className="movies-grid">
        {filteredMovies.map((movie) => (
          <Link to={`/movie/${movie.Movie_id}`} className="movie-card" key={movie.Movie_id}>
            <img src={movie.Poster_path} alt={movie.Title} />
            <h3>{movie.Title}</h3>
            <p>{movie.Release_year}</p>
            <p>{movie.genres}</p>
            <p>{countryNames[movie.Country] || movie.Country}</p>
            {movie.directors && <p>🎬 {movie.directors}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllMoviesPage;
