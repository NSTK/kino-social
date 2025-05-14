import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <p className="profile-loading">Загрузка профиля...</p>;
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">👤</div>
        <h2>{user.Name}</h2>
        <p><strong>Email:</strong> {user.Email}</p>
        <p><strong>Дата регистрации:</strong> {new Date(user.Registration_date).toLocaleDateString()}</p>

        <button className="logout-button" onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  );
};

export default ProfilePage;
