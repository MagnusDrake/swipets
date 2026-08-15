import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Filter, ArrowLeftRight } from 'lucide-react';
import { mockPets, availableTags } from '../data/pets';
import './SwipeView.css';

const animalTypesList = ['Dog', 'Cat', 'Small Animal'];

const SwipeView = ({ addFavorite, favorites }) => {
  const [pets, setPets] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [activeTypes, setActiveTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize and filter pets
  useEffect(() => {
    let filtered = mockPets.filter(p => !favorites.find(fav => fav.id === p.id));
    
    // Filter by type (OR logic)
    if (activeTypes.length > 0) {
      filtered = filtered.filter(p => activeTypes.includes(p.type));
    }

    // Filter by tag (AND logic)
    if (activeTags.length > 0) {
      filtered = filtered.filter(p => 
        activeTags.every(filter => p.tags.includes(filter))
      );
    }
    setPets(filtered);
  }, [activeTags, activeTypes, favorites]);

  const toggleTag = (tag) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  const toggleType = (type) => {
    if (activeTypes.includes(type)) {
      setActiveTypes(activeTypes.filter(t => t !== type));
    } else {
      setActiveTypes([...activeTypes, type]);
    }
  };

  const handleSwipe = (direction, pet) => {
    if (direction === 'right') {
      addFavorite(pet);
    }
    setPets(prev => prev.slice(1));
  };

  return (
    <div className="swipe-view">
      <div className="swipe-header">
        <div className="swipe-instructions">
          <ArrowLeftRight size={16} />
          <span>Swipe <strong>Right</strong> to Like, <strong>Left</strong> to Pass</span>
        </div>
        <button className="glass-panel filter-btn" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={18} />
          <span>Filters {(activeTags.length + activeTypes.length) > 0 && `(${activeTags.length + activeTypes.length})`}</span>
        </button>
      </div>

      {showFilters && (
        <div className="glass-panel filters-container">
          <p className="filter-label">Animal Type:</p>
          <div className="tags-flex" style={{marginBottom: '16px'}}>
            {animalTypesList.map(type => (
              <button 
                key={type}
                className={`tag-badge type-badge ${activeTypes.includes(type) ? 'selected' : ''}`}
                onClick={() => toggleType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <p className="filter-label">Match me with pets that are:</p>
          <div className="tags-flex">
            {availableTags.map(tag => (
              <button 
                key={tag}
                className={`tag-badge ${activeTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="cards-container">
        <AnimatePresence>
          {pets.length > 0 ? (
            <Card 
              key={pets[0].id} 
              pet={pets[0]} 
              onSwipe={(dir) => handleSwipe(dir, pets[0])} 
            />
          ) : (
            <div className="no-more-pets glass-panel">
              <Heart size={48} color="var(--accent-secondary)" style={{marginBottom: '16px'}} />
              <h2>You're all caught up!</h2>
              <p>Try adjusting your filters or check back later for more pets looking for a home.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {pets.length > 0 && (
        <div className="action-buttons">
          <button className="action-btn pass" onClick={() => handleSwipe('left', pets[0])}>
            <X size={32} />
          </button>
          <button className="action-btn like" onClick={() => handleSwipe('right', pets[0])}>
            <Heart size={32} />
          </button>
        </div>
      )}
    </div>
  );
};

const Card = ({ pet, onSwipe }) => {
  const [exitX, setExitX] = useState(0);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      setExitX(200);
      onSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      setExitX(-200);
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className="swipe-card glass-panel"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
    >
      <div className="card-image" style={{ backgroundImage: `url(${pet.image})` }}>
        <div className="card-info glass-panel">
          <div className="card-header">
            <h2>{pet.name}, {pet.age}</h2>
            <span className="breed">{pet.breed}</span>
          </div>
          <p className="desc">{pet.description}</p>
          <div className="tags">
            {pet.tags.map(tag => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeView;
