import React from "react";
import MovieCard from "./MovieCard";

const movies = [
  { title: "Интерстеллар", rating: 8.6, image: "" },
  { title: "Начало", rating: 8.8, image: "" }
];

const Recommendations = () => {
  return (
    <section className="recommendations">
      <h2>Рекомендации для вас</h2>
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <MovieCard key={index} {...movie} />
        ))}
      </div>
    </section>
  );
};

export default Recommendations;
