import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './FlyingCatGame.css';

// SVG Data URIs for Sprites to ensure they always load and have transparency
const SPRITES = {
  cat: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20,50 Q30,20 50,20 T80,50 Q80,80 50,80 T20,50' fill='%23f97316'/%3E%3Cpath d='M30,30 L20,10 L40,25 Z' fill='%23f97316'/%3E%3Cpath d='M70,30 L80,10 L60,25 Z' fill='%23f97316'/%3E%3Ccircle cx='40' cy='45' r='5' fill='white'/%3E%3Ccircle cx='60' cy='45' r='5' fill='white'/%3E%3Ccircle cx='40' cy='45' r='2' fill='black'/%3E%3Ccircle cx='60' cy='45' r='2' fill='black'/%3E%3Cpolygon points='45,55 55,55 50,60' fill='pink'/%3E%3Cpath d='M20,60 Q10,70 20,80' stroke='%23f97316' stroke-width='4' fill='none'/%3E%3C/svg%3E",
  dog: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%238b4513'/%3E%3Cpath d='M10,40 Q20,20 40,40 Z' fill='%235c2e0b'/%3E%3Cpath d='M90,40 Q80,20 60,40 Z' fill='%235c2e0b'/%3E%3Ccircle cx='35' cy='45' r='6' fill='white'/%3E%3Ccircle cx='65' cy='45' r='6' fill='white'/%3E%3Ccircle cx='35' cy='45' r='3' fill='black'/%3E%3Ccircle cx='65' cy='45' r='3' fill='black'/%3E%3Ccircle cx='50' cy='60' r='8' fill='black'/%3E%3Cpath d='M40,75 Q50,85 60,75' stroke='black' stroke-width='3' fill='none'/%3E%3C/svg%3E",
  mouse: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cellipse cx='50' cy='50' rx='30' ry='20' fill='%23a0aec0'/%3E%3Ccircle cx='25' cy='35' r='12' fill='%23718096'/%3E%3Ccircle cx='75' cy='35' r='12' fill='%23718096'/%3E%3Ccircle cx='35' cy='45' r='4' fill='black'/%3E%3Ccircle cx='65' cy='45' r='4' fill='black'/%3E%3Ccircle cx='50' cy='60' r='4' fill='pink'/%3E%3Cpath d='M80,50 Q100,50 90,70' stroke='%23a0aec0' stroke-width='3' fill='none'/%3E%3C/svg%3E"
};

const GAME_STATE = {
  START: 'START',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
  WON: 'WON'
};

const FlyingCatGame = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(GAME_STATE.START);
  const [score, setScore] = useState(0);

  // Game configuration
  const config = {
    gravity: 0.1,
    jumpPower: -5,
    gameSpeed: 2,
    catSize: 40,
    enemySize: 45,
    mouseSize: 30,
    winScore: 10
  };

  // Mutable game state for the animation loop
  const state = useRef({
    cat: { x: 50, y: 200, velocity: 0 },
    obstacles: [], // dogs
    collectibles: [], // mice
    frames: 0,
    animationId: null,
    images: {},
    isPlaying: false,
    status: GAME_STATE.START
  });

  // Preload images
  useEffect(() => {
    const imagesToLoad = ['cat', 'dog', 'mouse'];
    imagesToLoad.forEach(key => {
      const img = new Image();
      img.src = SPRITES[key];
      state.current.images[key] = img;
    });
  }, []);

  const jump = () => {
    if (state.current.status === GAME_STATE.GAME_OVER || state.current.status === GAME_STATE.WON) {
      return;
    }

    if (!state.current.isPlaying) {
      state.current.status = GAME_STATE.PLAYING;
      setGameState(GAME_STATE.PLAYING);
      state.current.isPlaying = true;
      state.current.cat.velocity = config.jumpPower; // Take off immediately
      startGameLoop();
    } else {
      state.current.cat.velocity = config.jumpPower;
    }
  };

  const resetGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    state.current = {
      ...state.current,
      cat: { x: 50, y: canvas.height / 2, velocity: 0 },
      obstacles: [],
      collectibles: [],
      frames: 0,
      isPlaying: false,
      status: GAME_STATE.START
    };
    setScore(0);
    setGameState(GAME_STATE.START);
    drawInitialState();
  };

  const drawInitialState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Platform
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.fillRect(state.current.cat.x - 10, state.current.cat.y + config.catSize, config.catSize + 20, 20);
    ctx.fillStyle = '#475569'; // slate-600
    ctx.fillRect(state.current.cat.x + 5, state.current.cat.y + config.catSize + 20, config.catSize - 10, canvas.height);

    // Draw Cat
    const img = state.current.images.cat;
    if (img && img.complete) {
      ctx.drawImage(img, state.current.cat.x, state.current.cat.y, config.catSize, config.catSize);
    } else {
      // Fallback rect if image not loaded yet
      ctx.fillStyle = '#f97316';
      ctx.fillRect(state.current.cat.x, state.current.cat.y, config.catSize, config.catSize);
    }
  };

  const checkCollision = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = state.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update Cat
    s.cat.velocity += config.gravity;
    // Terminal velocity to prevent plummeting on high refresh rate displays
    if (s.cat.velocity > 4.5) s.cat.velocity = 4.5;
    s.cat.y += s.cat.velocity;

    // Floor/Ceiling collision
    if (s.cat.y + config.catSize >= canvas.height) {
      s.cat.y = canvas.height - config.catSize;
      endGame(false);
      return;
    }
    if (s.cat.y <= 0) {
      s.cat.y = 0;
      s.cat.velocity = 0;
    }

    // Draw Cat
    ctx.drawImage(s.images.cat, s.cat.x, s.cat.y, config.catSize, config.catSize);

    // Spawn entities
    if (s.frames % 100 === 0) {
      // Spawn Dog
      s.obstacles.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - config.enemySize),
        width: config.enemySize,
        height: config.enemySize
      });
    }

    if (s.frames % 150 === 0) {
      // Spawn Mouse
      s.collectibles.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - config.mouseSize),
        width: config.mouseSize,
        height: config.mouseSize
      });
    }

    // Update and Draw Obstacles
    for (let i = s.obstacles.length - 1; i >= 0; i--) {
      const obs = s.obstacles[i];
      obs.x -= config.gameSpeed;
      ctx.drawImage(s.images.dog, obs.x, obs.y, obs.width, obs.height);

      // Collision with Dog
      if (checkCollision(
        { x: s.cat.x, y: s.cat.y, width: config.catSize - 10, height: config.catSize - 10 },
        { x: obs.x, y: obs.y, width: obs.width - 10, height: obs.height - 10 }
      )) {
        endGame(false);
        return;
      }

      if (obs.x + obs.width < 0) s.obstacles.splice(i, 1);
    }

    // Update and Draw Collectibles
    for (let i = s.collectibles.length - 1; i >= 0; i--) {
      const col = s.collectibles[i];
      col.x -= config.gameSpeed;
      ctx.drawImage(s.images.mouse, col.x, col.y, col.width, col.height);

      // Collision with Mouse
      if (checkCollision(
        { x: s.cat.x, y: s.cat.y, width: config.catSize, height: config.catSize },
        { x: col.x, y: col.y, width: col.width, height: col.height }
      )) {
        s.collectibles.splice(i, 1);
        setScore(prev => {
          const newScore = prev + 1;
          if (newScore >= config.winScore) {
            endGame(true);
          }
          return newScore;
        });
      }

      if (col.x + col.width < 0 && s.collectibles[i]) {
        s.collectibles.splice(i, 1);
      }
    }

    s.frames++;

    if (s.isPlaying) {
      s.animationId = requestAnimationFrame(gameLoop);
    }
  };

  const startGameLoop = () => {
    if (state.current.animationId) cancelAnimationFrame(state.current.animationId);
    state.current.animationId = requestAnimationFrame(gameLoop);
  };

  const endGame = (isWin) => {
    state.current.isPlaying = false;
    state.current.status = isWin ? GAME_STATE.WON : GAME_STATE.GAME_OVER;
    cancelAnimationFrame(state.current.animationId);
    setGameState(state.current.status);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas size relative to container
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      drawInitialState();
    }
    
    return () => {
      if (state.current.animationId) cancelAnimationFrame(state.current.animationId);
    };
  }, []);

  return (
    <div className="game-wrapper">
      <div className="game-header">
        <button className="icon-btn" onClick={() => navigate('/games')}>
          <ArrowLeft size={24} />
        </button>
        <div className="score-board glass-panel">
          Mice: {score} / {config.winScore}
        </div>
      </div>

      <div 
        className="canvas-container glass-panel" 
        onClick={jump}
        onTouchStart={(e) => { e.preventDefault(); jump(); }}
      >
        <canvas ref={canvasRef} className="game-canvas"></canvas>

        {gameState === GAME_STATE.START && (
          <div className="game-overlay">
            <h2>Flying Cat</h2>
            <p>Tap to fly! Dodge dogs, collect 10 mice.</p>
            <p className="pulse-text">Tap anywhere to start</p>
          </div>
        )}

        {gameState === GAME_STATE.GAME_OVER && (
          <div className="game-overlay lose">
            <h2>Ouch! You hit a dog.</h2>
            <p>Score: {score}</p>
            <button className="primary-button restart-btn" onClick={(e) => { e.stopPropagation(); resetGame(); }}>
              <RotateCcw size={18} /> Try Again
            </button>
          </div>
        )}

        {gameState === GAME_STATE.WON && (
          <div className="game-overlay win">
            <h2>You Win! 🎉</h2>
            <p>The cat is full and happy!</p>
            <button className="primary-button restart-btn" onClick={(e) => { e.stopPropagation(); resetGame(); }}>
              <RotateCcw size={18} /> Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlyingCatGame;
