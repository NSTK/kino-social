import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">🍿🎬КиноСеть</h1>
        <nav className="nav">
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/movies">Фильмы</Link></li>
            <li><Link to="/profile">Профиль</Link></li>
            <li><Link to="/friends">Друзья</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
