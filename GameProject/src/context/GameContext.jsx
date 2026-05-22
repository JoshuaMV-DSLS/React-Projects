// gamecontext.jsx
import { useState, createContext, useContext } from "react";
import { escapeMap } from "../components/escapeMap.js"; 

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [currentRoomId, setCurrentRoomId] = useState(0);
  const [inventory, setInventory] = useState([]); 
  const [collectedItemIds, setCollectedItemIds] = useState([]);
  

  // IDs de las habitaciones abiertas
  const [unlockedRoomIds, setUnlockedRoomIds] = useState([]);
  const [solvedPuzzleIds, setSolvedPuzzleIds] = useState([]);
  // mensaje de accion al intractuar con puertas y acertijos
  const [systemMessage, setSystemMessage] = useState("");


  const currentRoom = escapeMap[currentRoomId];

  const movePlayer = (direction) => {
    const nextRoomId = currentRoom.connections?.[direction];
    
    if (nextRoomId === undefined) {
      setSystemMessage("Camino bloqueado: Hay una pared.");
      const [solvedPuzzleIds, setSolvedPuzzleIds] = useState([]);
      return;
    }

    // Check Bloqueos
    const hasLock = currentRoom.lock && currentRoom.lock.direction === direction;
    const isAlreadyUnlocked = unlockedRoomIds.includes(currentRoom.id);

    if (hasLock && !isAlreadyUnlocked) {
      // ¿El jugador tiene el objeto requerido?
      const hasRequiredItem = inventory.some(item => item.id === currentRoom.lock.requiredItem);

      if (hasRequiredItem) {
        // ÉXITO
        setUnlockedRoomIds([...unlockedRoomIds, currentRoom.id]);
        setCurrentRoomId(nextRoomId);
        setSystemMessage(currentRoom.lock.unlockedDescription);
      } else {
        // BLOQUEADO:
        setSystemMessage(currentRoom.lock.lockedDescription);
      }
    } else {
      // Movimiento normal
      setCurrentRoomId(nextRoomId);
      setSystemMessage("");
    }
  };

// ¿Puzzle resuelto?
const isCurrentPuzzleSolved = currentRoom.puzzle ? solvedPuzzleIds.includes(currentRoom.puzzle.id) : false;

  const pickUpItem = (item) => {
    if (inventory.length >=5) {
      setSystemMessage("¡Tu inventario está lleno! No puedes cargar más de 5 objetos.");
      return;
    }
    if (!inventory.some(i => i.id === item.id)) {
      setInventory([...inventory, item]);
      setCollectedItemIds([...collectedItemIds, item.id]);
      setSystemMessage(`Recogiste: ${item.name}`);
    }
  };

  const solveCodePuzzle = (inputCode) => {
  const puzzle = currentRoom.puzzle;
  
  if (!puzzle) return;

  if (inputCode === puzzle.solution) {
    // 1. Registrar puzzle como resuelto
    setSolvedPuzzleIds([...solvedPuzzleIds, puzzle.id]);
    setSystemMessage(puzzle.solvedMessage);

    // 2. Dar recompensa automáticamente si el inventario tiene espacio
    if (puzzle.rewardItem && inventory.length < 5) {
      setInventory([...inventory, puzzle.rewardItem]);
    } else if (inventory.length >=5) {
      setSystemMessage(`${puzzle.solvedMessage} (Tu inventario está lleno para recibir la recompensa, tira algo primero).`);
    }
  } else {
    setSystemMessage("❌ Código incorrecto. Acceso denegado.");
  }
};


  return (
    <GameContext.Provider value={{
      currentRoom, 
      currentRoomId, 
      inventory, 
      collectedItemIds, 
      unlockedRoomIds,
      isCurrentPuzzleSolved,
      systemMessage,
      setSystemMessage,
      movePlayer, 
      pickUpItem,
      solveCodePuzzle
    }}>
      {children}
    </GameContext.Provider>
  );
}