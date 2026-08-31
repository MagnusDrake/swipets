import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Filter, ArrowLeftRight, Sparkles, RotateCcw, Flame, Compass } from 'lucide-react';
import { mockPets, availableTags } from '../data/pets';
import { 
  loadUserProfile, 
  recordInteraction, 
  rankPetsWithAlgorithm, 
  getTasteInsights,
  resetUserProfile 
} from '../utils/recommendationEngine';
import './SwipeView.css';

const animalTypesList = ['Dog', 'Cat', 'Small Animal'];

const SwipeView = ({ addFavorite, favorites }) => {
  const [pets, setPets] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [activeTypes, setActiveTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAlgorithmDrawer, setShowAlgorithmDrawer] = useState(false);
  const [userProfile, setUserProfile] = useState(loadUserProfile);
  
  // Dwell timer reference
  const cardStartTimeRef = useRef(Date.now());

  // Initialize and rank pets using the FYP recommendation algorithm
  useEffect(() => {
    let unswiped = mockPets.filter(p => !favorites.find(fav => fav.id === p.id));
    
    // Filter by type (OR logic)
    if (activeTypes.length > 0) {
      unswiped = unswiped.filter(p => activeTypes.includes(p.type));
    }

    // Filter by tag (AND logic)
    if (activeTags.length > 0) {
      unswiped = unswiped.filter(p => 
        activeTags.every(filter => p.tags.includes(filter))
      );
    }

    // Pass through TikTok-style ranking engine
    const ranked = rankPetsWithAlgorithm(unswiped, userProfile);
    setPets(ranked);
    cardStartTimeRef.current = Date.now();
  }, [activeTags, activeTypes, favorites, userProfile.interactions.totalSwipes]);

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
    const dwellTimeMs = Date.now() - cardStartTimeRef.current;
    
    // Record interaction in the recommendation engine
    const updatedProfile = recordInteraction(
      pet, 
      direction === 'right' ? 'like' : 'pass', 
      dwellTimeMs, 
      userProfile
    );
    setUserProfile(updatedProfile);

    if (direction === 'right') {
      addFavorite(pet);
    }

    // Advance to next card and reset dwell timer
    setPets(prev => prev.slice(1));
    cardStartTimeRef.current = Date.now();
  };

  const handleResetTaste = () => {
    const fresh = resetUserProfile();
    setUserProfile(fresh);
  };

  const tasteInsights = getTasteInsights(userProfile);

  return (
    <div className="swipe-view">
      <div className="swipe-header">
        <div className="swipe-instructions">
          <ArrowLeftRight size={16} />
          <span>Swipe <strong>Right</strong> to Like, <strong>Left</strong> to Pass</span>
        </div>
        
        <div className="header-controls">
          <button 
            className={`glass-panel algorithm-badge-btn ${userProfile.interactions.totalSwipes > 0 ? 'active' : ''}`}
            onClick={() => setShowAlgorithmDrawer(!showAlgorithmDrawer)}
            title="View For You Algorithm Insights"
          >
            <Sparkles size={16} color="var(--accent-secondary)" />
            <span>FYP AI {userProfile.interactions.totalSwipes > 0 && `(${userProfile.interactions.totalSwipes})`}</span>
          </button>

          <button className="glass-panel filter-btn" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18} />
            <span>Filters {(activeTags.length + activeTypes.length) > 0 && `(${activeTags.length + activeTypes.length})`}</span>
          </button>
        </div>
      </div>

      {/* Algorithm Insights Drawer */}
      {showAlgorithmDrawer && (
        <div className="glass-panel algorithm-insights-panel">
          <div className="algo-panel-header">
            <div className="algo-title">
              <Sparkles size={18} color="var(--accent-secondary)" />
              <h3>Your "For You" Taste Profile</h3>
            </div>
            <button className="icon-btn-small" onClick={handleResetTaste} title="Reset AI taste profile">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
          
          <p className="algo-desc">
            Our recommendation engine dynamically tracks your swipe speed, dwell time, and likes to learn what companions fit your lifestyle.
          </p>

          <div className="algo-stats-grid">
            <div className="algo-stat-item">
              <span className="stat-num">{userProfile.interactions.likes}</span>
              <span className="stat-label">Likes</span>
            </div>
            <div className="algo-stat-item">
              <span className="stat-num">{userProfile.interactions.passes}</span>
              <span className="stat-label">Skips</span>
            </div>
            <div className="algo-stat-item">
              <span className="stat-num">{(userProfile.interactions.avgDwellTimeMs / 1000).toFixed(1)}s</span>
              <span className="stat-label">Avg Dwell</span>
            </div>
          </div>

          <div className="algo-insights-tags">
            <span className="insight-heading">Learned Preferences:</span>
            {tasteInsights.map((insight, idx) => (
              <span key={idx} className="algo-insight-pill">
                {insight}
              </span>
            ))}
          </div>
        </div>
      )}

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
              <p>Try adjusting your filters or resetting your FYP algorithm to discover more pets looking for a home.</p>
              <button className="primary-button" style={{marginTop: '16px'}} onClick={handleResetTaste}>
                Reset Algorithm Deck
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {pets.length > 0 && (
        <div className="action-buttons">
          <button className="action-btn pass" onClick={() => handleSwipe('left', pets[0])} title="Pass">
            <X size={32} />
          </button>
          <button className="action-btn like" onClick={() => handleSwipe('right', pets[0])} title="Love">
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

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'high-match': return <Flame size={14} color="#f97316" />;
      case 'wildcard': return <Compass size={14} color="#fbbf24" />;
      default: return <Sparkles size={14} color="#38bdf8" />;
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
        {/* Recommendation Badge */}
        {pet.matchBadge && (
          <div className={`algo-match-pill ${pet.badgeType || 'match'}`}>
            {getBadgeIcon(pet.badgeType)}
            <span>{pet.matchBadge}</span>
          </div>
        )}

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
