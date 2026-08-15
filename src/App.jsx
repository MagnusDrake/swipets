import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, Bone, HeartHandshake, ShieldAlert, Smartphone, Info, Search, Gamepad2 } from 'lucide-react';
import SwipeView from './components/SwipeView';
import MatchesView from './components/MatchesView';
import GetInvolvedView from './components/GetInvolvedView';
import LostAndFoundView from './components/LostAndFoundView';
import SocialFeedView from './components/SocialFeedView';
import AboutView from './components/AboutView';
import GamesView from './components/GamesView';
import FlyingCatGame from './components/games/FlyingCatGame';
import './App.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: PawPrint, label: 'Discover' },
    { path: '/matches', icon: Bone, label: 'Favorites & Forms' },
    { path: '/involved', icon: HeartHandshake, label: 'Get Involved' },
    { path: '/control', icon: ShieldAlert, label: 'Lost & Found' },
    { path: '/social', icon: Smartphone, label: 'Social Feed' },
    { path: '/games', icon: Gamepad2, label: 'Games' },
    { path: '/about', icon: Info, label: 'About Us' }
  ];

  return (
    <nav className="nav-bar">
      {/* Desktop Logo */}
      <div className="desktop-logo logo" style={{display: window.innerWidth >= 768 ? 'block' : 'none'}}>
        <span style={{color: 'var(--accent-secondary)'}}>Swipets</span>
        <br />
        <span style={{fontSize: '0.8rem', color: '#cbd5e1'}}>Find your purr-fect match</span>
      </div>

      {navItems.map((item) => (
        <button 
          key={item.path} 
          className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <item.icon size={24} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

function App() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pet-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pet-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (pet) => {
    if (!favorites.find(p => p.id === pet.id)) {
      setFavorites([...favorites, pet]);
    }
  };

  const removeFavorite = (petId) => {
    setFavorites(favorites.filter(p => p.id !== petId));
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Mobile Header */}
        <header className="app-header">
          <div className="logo">
            <span style={{color: 'var(--accent-secondary)'}}>Swipets</span>
            <br />
            <span style={{fontSize: '0.8rem', color: '#cbd5e1'}}>Find your purr-fect match</span>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Search size={20} /></button>
          </div>
        </header>

        <Navigation />

        <main className="main-content">
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<SwipeView addFavorite={addFavorite} favorites={favorites} />} />
              <Route path="/matches" element={<MatchesView favorites={favorites} removeFavorite={removeFavorite} />} />
              <Route path="/involved" element={<GetInvolvedView />} />
              <Route path="/control" element={<LostAndFoundView />} />
              <Route path="/social" element={<SocialFeedView />} />
              <Route path="/games" element={<GamesView />} />
              <Route path="/games/flying-cat" element={<FlyingCatGame />} />
              <Route path="/about" element={<AboutView />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
