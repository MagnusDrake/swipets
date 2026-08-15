import React from 'react';
import './AboutView.css';

const AboutView = () => {
  return (
    <div className="view-container about-view">
      <h2 className="view-title">About Swipets</h2>
      
      <div className="glass-panel info-card">
        <h3>Our Mission</h3>
        <p>
          Welcome to <strong>Swipets</strong>! We believe finding your new furry best friend should be as fun and exciting as finding a date. 
          Swipe right on cuteness, match with personalities that fit your lifestyle, and fall in love! 💖
        </p>
        <p>
          We are a modern, digital-first community dedicated to connecting lovable pets with their forever homes. 
          No more sad cages—just happy tails and perfect matches.
        </p>
      </div>

      <div className="glass-panel info-card">
        <h3>Volunteering</h3>
        <p>
          We rely on volunteers to help us care for the animals and keep our shelter running smoothly. 
          Whether you want to walk dogs, socialize with cats, or help out at events, we have a place for you!
        </p>
        <button className="primary-button" style={{marginTop: '10px'}}>Sign Up to Volunteer</button>
      </div>

      <div className="glass-panel info-card highlight">
        <h3>We're Hiring!</h3>
        <p>
          Passionate about animals? Join our dedicated team! We are currently looking for animal care technicians.
        </p>
        <button className="primary-button">View Open Positions</button>
      </div>
      
      <div className="contact-info">
        <p><strong>HQ:</strong> 123 Paws Avenue, Pet City, PC 12345</p>
        <p><strong>Email:</strong> hello@swipets.com</p>
      </div>
    </div>
  );
};

export default AboutView;
