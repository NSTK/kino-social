import React from 'react';
import '../App.css';

const ProfilePage = () => {
  return (
    <div>
      <h2>Страница профиля</h2>
      <div className="user-info">
        <img src="https://via.placeholder.com/100" alt="Аватар пользователя" />
        <div>
          <h3>Иван Иванов</h3>
          <p>Понравившихся фильмов: 12</p>
          <p>Рекомендаций: 8</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;