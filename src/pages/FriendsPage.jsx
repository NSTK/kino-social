import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FriendsPage.css';
import { useAuth } from '../context/AuthContext';

const FriendsPage = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchFriends = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/api/friends?currentUserId=${user.User_id}`);
          setFriends(res.data);
        } catch (err) {
          console.error('Ошибка при загрузке друзей:', err);
        }
      };

      const fetchAllUsers = async () => {
        try {
          const res = await axios.get('http://localhost:3001/api/users');
          setAllUsers(
            res.data.filter((u) => u.User_id !== user.User_id) // исключить самого себя
          );
        } catch (err) {
          console.error('Ошибка при загрузке пользователей:', err);
        }
      };

      fetchFriends();
      fetchAllUsers();
    }
  }, [user]);

  const handleAddFriend = async (friendId) => {
    try {
      await axios.post('http://localhost:3001/api/friends', {
        currentUserId: user.User_id,
        friendId,
      });
      // Обновляем список
      const addedUser = allUsers.find((u) => u.User_id === friendId);
      setFriends((prev) => [...prev, addedUser]);
      setAllUsers((prev) => prev.filter((u) => u.User_id !== friendId));
    } catch (err) {
      console.error('Ошибка при добавлении в друзья:', err);
    }
  };

  return (
    <div className="friends-page">
      <section className="friends-section">
        <h2>👥 Мои друзья</h2>
        {friends.length === 0 ? (
          <p>У вас пока нет друзей.</p>
        ) : (
          <ul>
            {friends.map((f) => (
              <li key={f.User_id}>
                {f.Name} ({f.Email})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="all-users-section">
        <h2>➕ Добавить друзей</h2>
        {allUsers.length === 0 ? (
          <p>Нет пользователей для добавления.</p>
        ) : (
          <ul>
            {allUsers.map((u) => (
              <li key={u.User_id}>
                {u.Name} ({u.Email}){' '}
                <button onClick={() => handleAddFriend(u.User_id)}>Добавить</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default FriendsPage;
