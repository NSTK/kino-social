import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Recommendations from './components/Recommendations';
import Profile from './components/Profile';
import ProfilePage from './components/ProfilePage';
import FriendsPage from './components/FriendsPage';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<><Recommendations /><Profile /></>} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/friends" element={<FriendsPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;