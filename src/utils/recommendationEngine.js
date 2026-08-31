/**
 * Swipets TikTok-style "For You" Recommendation Engine (FYP)
 * 
 * Features:
 * - Implicit signal tracking (card dwell time, fast-skips vs. long contemplation)
 * - Explicit signal tracking (swipes right/left, favorites)
 * - User taste vector with decaying weights
 * - 80/20 Exploitation vs. Exploration (Serendipity wildcards)
 * - Rescue boost for underdog / long-timer pets
 */

const STORAGE_KEY = 'swipets-fyp-profile';

// Default baseline taste profile
export const getDefaultProfile = () => ({
  species: {
    Dog: 0,
    Cat: 0,
    'Small Animal': 0
  },
  tags: {},
  interactions: {
    totalSwipes: 0,
    likes: 0,
    passes: 0,
    avgDwellTimeMs: 0
  },
  lastUpdated: Date.now()
});

// Load profile from localStorage
export const loadUserProfile = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getDefaultProfile();
    const parsed = JSON.parse(saved);
    return {
      ...getDefaultProfile(),
      ...parsed,
      species: { ...getDefaultProfile().species, ...(parsed.species || {}) },
      tags: parsed.tags || {},
      interactions: { ...getDefaultProfile().interactions, ...(parsed.interactions || {}) }
    };
  } catch (e) {
    console.error('Error loading taste profile:', e);
    return getDefaultProfile();
  }
};

// Save profile to localStorage
export const saveUserProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving taste profile:', e);
  }
};

// Reset profile
export const resetUserProfile = () => {
  const fresh = getDefaultProfile();
  saveUserProfile(fresh);
  return fresh;
};

/**
 * Record a user interaction with a pet and update the algorithm weights
 * @param {Object} pet - Pet data
 * @param {'like' | 'pass'} action - Swipe action
 * @param {number} dwellTimeMs - Time spent looking at this card in milliseconds
 * @param {Object} currentProfile - Existing user profile
 * @returns {Object} Updated profile
 */
export const recordInteraction = (pet, action, dwellTimeMs = 2000, currentProfile) => {
  const profile = currentProfile ? { ...currentProfile } : loadUserProfile();
  
  const species = pet.type || 'Dog';
  const petTags = pet.tags || [];

  // Initialize tags if new
  petTags.forEach(tag => {
    if (typeof profile.tags[tag] !== 'number') {
      profile.tags[tag] = 0;
    }
  });

  // Calculate dwell time multiplier
  // Fast skip (< 1.2s): high confidence disinterest
  // Long dwell (> 3.5s): high engagement interest even if passed
  const isFastSkip = dwellTimeMs < 1200;
  const isLongDwell = dwellTimeMs > 3500;

  if (action === 'like') {
    // Explicit like (strong positive)
    const boost = isLongDwell ? 3.5 : 2.5;
    profile.species[species] = (profile.species[species] || 0) + boost;
    
    petTags.forEach(tag => {
      profile.tags[tag] = (profile.tags[tag] || 0) + (boost * 0.8);
    });

    profile.interactions.likes += 1;
  } else {
    // Pass
    if (isFastSkip) {
      // Rapid swipe left: Strong disinterest signal
      profile.species[species] = (profile.species[species] || 0) - 1.2;
      petTags.forEach(tag => {
        profile.tags[tag] = (profile.tags[tag] || 0) - 0.8;
      });
    } else if (isLongDwell) {
      // Looked for a long time before passing (soft interest / contemplation)
      profile.species[species] = (profile.species[species] || 0) + 0.5;
      petTags.forEach(tag => {
        profile.tags[tag] = (profile.tags[tag] || 0) + 0.3;
      });
    } else {
      // Standard pass
      profile.species[species] = (profile.species[species] || 0) - 0.4;
      petTags.forEach(tag => {
        profile.tags[tag] = (profile.tags[tag] || 0) - 0.3;
      });
    }

    profile.interactions.passes += 1;
  }

  // Update interaction metadata
  profile.interactions.totalSwipes += 1;
  profile.interactions.avgDwellTimeMs = Math.round(
    ((profile.interactions.avgDwellTimeMs * (profile.interactions.totalSwipes - 1)) + dwellTimeMs) / 
    profile.interactions.totalSwipes
  );
  profile.lastUpdated = Date.now();

  saveUserProfile(profile);
  return profile;
};

/**
 * Score and rank a deck of pets using the TikTok FYP recommendation model
 * @param {Array} pets - Unswiped pets
 * @param {Object} userProfile - User taste weights
 * @returns {Array} Ranked pets with matchScore & matchBadge
 */
export const rankPetsWithAlgorithm = (pets, userProfile) => {
  if (!pets || pets.length === 0) return [];
  const profile = userProfile || loadUserProfile();
  const totalSwipes = profile.interactions.totalSwipes;

  // Score each pet
  const scoredPets = pets.map((pet, index) => {
    const speciesScore = profile.species[pet.type] || 0;
    
    // Tag affinity score
    let tagScoreSum = 0;
    (pet.tags || []).forEach(tag => {
      tagScoreSum += (profile.tags[tag] || 0);
    });
    const avgTagScore = (pet.tags && pet.tags.length > 0) 
      ? tagScoreSum / pet.tags.length 
      : 0;

    // Rescue/Underdog boost for long-timers or shy pets
    let underdogBoost = 0;
    if (pet.tags?.includes('lonely') || pet.isLongTimer) {
      underdogBoost += 1.2;
    }

    // Exploration factor (Wildcard injection)
    // Injects dynamic variety to break echo chambers
    const explorationNoise = (Math.sin(index * 997 + totalSwipes) * 1.5);
    
    // Combined raw score
    const rawAffinity = (speciesScore * 1.2) + (avgTagScore * 1.5) + underdogBoost;
    const finalRankScore = (rawAffinity * 0.8) + (explorationNoise * 0.2);

    // Calculate human-friendly match percentage (60% - 99%)
    // Soft sigmoid-style scaling
    let matchPct = 75;
    if (totalSwipes > 2) {
      matchPct = Math.min(99, Math.max(55, Math.round(75 + (rawAffinity * 3.5))));
    } else {
      // Early onboarding score
      matchPct = Math.round(75 + (index % 15));
    }

    // Determine smart recommendation badge
    let badge = '✨ Top Pick';
    let badgeType = 'match';

    if (totalSwipes >= 3) {
      if (matchPct >= 92) {
        badge = `🔥 ${matchPct}% Match`;
        badgeType = 'high-match';
      } else if (explorationNoise > 0.9 && matchPct < 85) {
        badge = '🎲 Surprise Discovery';
        badgeType = 'wildcard';
      } else if (pet.tags?.includes('lonely') || pet.isLongTimer) {
        badge = '🐾 Shelter Underdog';
        badgeType = 'underdog';
      } else if (matchPct >= 80) {
        badge = `✨ ${matchPct}% Match`;
        badgeType = 'match';
      } else {
        badge = '👀 For You';
        badgeType = 'foryou';
      }
    } else {
      badge = '🐾 New Arrival';
      badgeType = 'new';
    }

    return {
      ...pet,
      _algoScore: finalRankScore,
      matchPct,
      matchBadge: badge,
      badgeType
    };
  });

  // Sort descending by calculated algorithm score
  return scoredPets.sort((a, b) => b._algoScore - a._algoScore);
};

/**
 * Get human-readable taste insights from user profile
 * @param {Object} profile 
 * @returns {Array<string>} list of taste tags
 */
export const getTasteInsights = (profile) => {
  if (!profile || profile.interactions.totalSwipes < 3) {
    return ['Swiping to learn your preferences...'];
  }

  const insights = [];
  
  // Top species
  const topSpecies = Object.entries(profile.species)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 1.5);
  
  if (topSpecies.length > 0) {
    insights.push(`Loves ${topSpecies[0][0]}s`);
  }

  // Top tags
  const topTags = Object.entries(profile.tags)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 1.0)
    .slice(0, 3)
    .map(([tag]) => tag);

  if (topTags.length > 0) {
    insights.push(`Enjoys ${topTags.join(', ')} pets`);
  }

  return insights.length > 0 ? insights : ['Developing taste profile...'];
};
