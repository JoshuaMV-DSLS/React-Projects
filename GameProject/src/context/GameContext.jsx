// src/context/GameContext.jsx
import { createContext } from "react";
import { useGameState } from "../hooks/useGameState.js";

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Inicializa motor de juego separado en un hook personalizado
  const gameState = useGameState();

  return (
    // Se pasa todo el paquete de datos y funciones a la aplicación
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
}