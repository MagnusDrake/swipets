import React from 'react';
import { Trash2, MessageCircle, FileText } from 'lucide-react';
import './MatchesView.css';

const MatchesView = ({ favorites, removeFavorite }) => {
  return (
    <div className="view-container">
      <h2 className="view-title">Favorites & Forms</h2>

      <div className="forms-section glass-panel">
        <div className="section-header">
          <FileText color="var(--accent-secondary)" size={24} />
          <h3>Application Forms</h3>
        </div>
        <p>Ready to take the next step with one of your matches? Fill out our application forms.</p>
        <div className="form-links">
          <button className="link-btn">Adoption Application</button>
          <button className="link-btn">Foster Application</button>
        </div>
      </div>

      <h3 style={{marginBottom: '16px', marginTop: '32px', color: '#fff'}}>Your Matched Pets</h3>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>Go to the discover page and start swiping right to find your perfect match!</p>
        </div>
      ) : (
        <div className="matches-grid">
          {favorites.map(pet => (
            <div key={pet.id} className="match-card glass-panel">
              <div className="match-image" style={{ backgroundImage: `url(${pet.image})` }}></div>
              <div className="match-info">
                <h3>{pet.name}</h3>
                <p>{pet.breed}</p>
                <div className="match-actions">
                  <button className="match-btn primary-btn">
                    <MessageCircle size={16} /> Inquire
                  </button>
                  <button className="match-btn remove-btn" onClick={() => removeFavorite(pet.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesView;
