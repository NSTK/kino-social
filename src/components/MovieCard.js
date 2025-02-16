import React from "react";

const MovieCard = ({ title, rating, image }) => {
  return (
    <div className="movie-card">
      <img src={image} alt={title} />
      <div className="movie-info">
        <h3>{title}</h3>
        <p>Рейтинг: {rating}/10</p>
        <button>Подробнее</button>
      </div>
    </div>
  );
};

export default MovieCard;
