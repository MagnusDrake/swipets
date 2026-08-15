import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Play } from 'lucide-react';
import './GamesView.css';

const GamesView = () => {
  const navigate = useNavigate();

  return (
    <div className="view-container games-view">
      <h2 className="view-title">Mini-Games</h2>
      
      <p style={{color: '#cbd5e1', marginBottom: '24px'}}>
        Take a break and play some fun pet-themed games!
      </p>

      <div className="games-grid">
        <div className="game-card glass-panel" onClick={() => navigate('/games/flying-cat')}>
          <div className="game-thumbnail">
             {/* Thumbnail placeholder */}
             <div className="game-icon-bg">
                <Gamepad2 size={48} color="#fff" />
             </div>
          </div>
          <div className="game-info">
            <h3>Flying Cat</h3>
            <p>Dodge the flying dogs and collect 10 mice to win!</p>
            <button className="primary-button full-width play-btn">
              <Play size={18} /> Play Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesView;
