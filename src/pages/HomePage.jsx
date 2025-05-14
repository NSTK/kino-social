import React from 'react';
import MovieCarousel from '../components/MovieCarousel';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="carousel-section">
        <h2 className="carousel-title">🎬 Рекомендации из классикики кино</h2>
        <MovieCarousel filter="classic" limit={5} />
      </section>

      <section className="carousel-section">
        <h2 className="carousel-title">🆕 Рекомендации из новинок кино</h2>
        <MovieCarousel filter="new" limit={5} />
      </section>
    </div>
  );
};

export default HomePage;
