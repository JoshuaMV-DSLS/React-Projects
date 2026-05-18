// gamecontext.jsx
import { useState, createContext, useContext } from "react";
import { escapeMap } from "../components/escapeMap.js"; 

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [currentRoomId, setCurrentRoomId] = useState(0);
  const [inventory, setInventory] = useState([]); 
  const [collectedItemIds, setCollectedItemIds] = useState([]); 

  const currentRoom = escapeMap[currentRoomId];

  const movePlayer = (direction) => {
    const nextRoomId = currentRoom.connections?.[direction];
    if (nextRoomId !== undefined) {
      setCurrentRoomId(nextRoomId);
    } else {
      console.log("Camino bloqueado.");
    }
  };

  const pickUpItem = (item) => {
    if (inventory.length >= 2) {
      console.log("¡Inventario lleno!");
      return;
    }
    if (!inventory.some(i => i.id === item.id)) {
      setInventory([...inventory, item]);
      setCollectedItemIds([...collectedItemIds, item.id]);
    }
  };

  return (
    <GameContext.Provider value={{
      currentRoom, currentRoomId, inventory, collectedItemIds, movePlayer, pickUpItem
    }}>
      {children}
    </GameContext.Provider>
  );
}