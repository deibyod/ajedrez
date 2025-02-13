import React from 'react';
import './GameModeSelector.css';

const GameModeSelector = ({ setGameMode }) => {
  return (
    <div className="game-mode-selector">
      <button onClick={() => setGameMode('multiplayer')}>Modo Multijugador</button>
      <button onClick={() => setGameMode('singleplayer')}>Modo Individual</button>
    </div>
  );
};

export default GameModeSelector;