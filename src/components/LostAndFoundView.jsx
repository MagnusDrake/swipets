import React, { useState } from 'react';
import { AlertTriangle, Search, Phone, MapPin, MessageCircle } from 'lucide-react';
import { missingPets, foundPets } from '../data/pets';
import './LostAndFoundView.css';

const LostAndFoundView = () => {
  const [activeTab, setActiveTab] = useState('missing');

  return (
    <div className="view-container lost-and-found-view">
      <h2 className="view-title">Lost & Found</h2>
      
      <div className="glass-panel alert-header">
        <MessageCircle color="var(--accent-secondary)" size={24} />
        <p>If you have found a stray animal or lost your pet, post it here to notify the Swipets community! Let's get these furry friends home safe.</p>
        <button className="primary-button full-width alert-btn">Create a Community Post</button>
      </div>

      <div className="control-tabs">
        <button 
          className={`control-tab ${activeTab === 'missing' ? 'active' : ''}`}
          onClick={() => setActiveTab('missing')}
        >
          <Search size={18} /> Lost Pets
        </button>
        <button 
          className={`control-tab ${activeTab === 'found' ? 'active' : ''}`}
          onClick={() => setActiveTab('found')}
        >
          <AlertTriangle size={18} /> Found Pets
        </button>
      </div>

      <div className="control-content">
        {activeTab === 'missing' && (
          <div className="control-grid">
            {missingPets.map(pet => (
              <div key={pet.id} className="control-card glass-panel">
                <div className="control-image" style={{ backgroundImage: `url(${pet.image})` }}></div>
                <div className="control-info">
                  <h3>{pet.name}</h3>
                  <span className="control-tag missing">Lost</span>
                  <p className="desc">{pet.description}</p>
                  <p className="detail"><MapPin size={14}/> <strong>Last Seen:</strong> {pet.lastSeen}</p>
                  <p className="detail"><strong>Date Lost:</strong> {pet.dateLost}</p>
                  <button className="contact-btn">
                    <Phone size={14} /> Contact: {pet.contact}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'found' && (
          <div className="control-grid">
            {foundPets.map(pet => (
              <div key={pet.id} className="control-card glass-panel">
                <div className="control-image" style={{ backgroundImage: `url(${pet.image})` }}></div>
                <div className="control-info">
                  <h3>{pet.breed}</h3>
                  <span className="control-tag found">Found</span>
                  <p className="desc">{pet.description}</p>
                  <p className="detail"><MapPin size={14}/> <strong>Found At:</strong> {pet.foundLocation}</p>
                  <p className="detail"><strong>Date Found:</strong> {pet.dateFound}</p>
                  {pet.contact && (
                    <button className="contact-btn found-btn">
                      <Phone size={14} /> Contact Finder: {pet.contact}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LostAndFoundView;
