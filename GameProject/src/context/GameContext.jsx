// src/context/GameContext.jsx
import { createContext } from "react";
import { useGameState } from "../hooks/useGameState.js";

export const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const gameState = useGameState();

  return (
    <GameContext.Provider value={gameState}> 
      {children}
    </GameContext.Provider>
  );
};