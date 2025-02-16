import React from "react";

const Profile = () => {
  return (
    <section className="profile">
      <h2>Ваш профиль</h2>
      <div className="user-info">
        <img src="https://via.placeholder.com/100" alt="Аватар пользователя" />
        <div>
          <h3>Иван Иванов</h3>
          <p>Понравившихся фильмов: 12</p>
          <p>Рекомендаций: 8</p>
        </div>
      </div>
    </section>
  );
};

export default Profile;
