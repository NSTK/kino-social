import React from 'react';
import '../App.css';

const Carousel = () => {
  return (
    <div className="carousel">
      <div className="carousel-slide">
        <img src="" alt="Новинка 1" />
      </div>
      <div className="carousel-slide">
        <img src="" alt="Новинка 2" />
      </div>
      <div className="carousel-slide">
        <img src="" alt="Новинка 3" />
      </div>
      <div className="carousel-dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default Carousel;
