import React from 'react';
import { HeartHandshake, Briefcase, HandCoins } from 'lucide-react';
import './GetInvolvedView.css';

const GetInvolvedView = () => {
  return (
    <div className="view-container get-involved-view">
      <h2 className="view-title">Get Involved</h2>

      <div className="glass-panel info-section">
        <div className="section-header">
          <HandCoins color="var(--accent-primary)" size={24} />
          <h3>Donate & Support</h3>
        </div>
        <p>
          We rely on generous friends and supporters like you. A contribution helps pay for food, 
          shelter, and veterinary care for animals in need. 
        </p>
        <button className="primary-button full-width" style={{marginTop: '12px'}}>Donate Now</button>
      </div>

      <div className="glass-panel info-section">
        <div className="section-header">
          <HeartHandshake color="var(--accent-secondary)" size={24} />
          <h3>Volunteering</h3>
        </div>
        <p>
          We rely on volunteers to help us care for the animals and keep our shelter running smoothly. 
          Whether you want to walk dogs, socialize with cats, or help out at events, we have a place for you!
        </p>
        <button className="primary-button full-width" style={{marginTop: '12px'}}>Sign Up to Volunteer</button>
      </div>

      <div className="glass-panel info-section highlight">
        <div className="section-header">
          <Briefcase color="var(--accent-primary)" size={24} />
          <h3>We're Hiring!</h3>
        </div>
        <p>
          Passionate about animals? Join our dedicated team! We are currently looking for animal care technicians.
        </p>
        <button className="primary-button full-width" style={{marginTop: '12px'}}>View Open Positions</button>
      </div>
    </div>
  );
};

export default GetInvolvedView;
