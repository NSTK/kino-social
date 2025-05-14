import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3001/api/register', form);
      navigate('/login');
    } catch (err) {
      alert('Ошибка при регистрации');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Регистрация</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Имя"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Пароль"
        />
        <button onClick={handleRegister}>Зарегистрироваться</button>
        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
