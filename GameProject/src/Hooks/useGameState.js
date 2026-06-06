// src/hooks/useGameState.js
import { useState, useMemo } from "react";
import { escapeMap } from "../components/escapeMap.js";
import { checkMovementBlock } from "../utils/movementRules.js";

export function useGameState() {
  // 1. Declaramos el estado ANTES de usarlo en el useMemo
  const [currentRoomId, setCurrentRoomId] = useState("room1");
  const [inventory, setInventory] = useState([]); 
  const [collectedItemIds, setCollectedItemIds] = useState([]);
  const [unlockedRoomIds, setUnlockedRoomIds] = useState([]);
  const [solvedPuzzleIds, setSolvedPuzzleIds] = useState([]);
  const [systemMessage, setSystemMessage] = useState("");

  // 2. Calcula la habitación actual
  const currentRoom = useMemo(() => {
    return escapeMap[currentRoomId] || Object.values(escapeMap)[0];
  }, [currentRoomId]);

  const movePlayer = (direction) => {
    console.log("--- Intento de movimiento ---");
    // Si currentRoom no existe por alguna razón, protegemos el código
        if (!currentRoom) return;

        let nextX = currentRoom.x;
        let nextY = currentRoom.y;

        if (direction === "north") nextY -= 1;
        if (direction === "south") nextY += 1;
        if (direction === "west")  nextX -= 1;
        if (direction === "east")  nextX += 1;

        const nextRoom = Object.values(escapeMap).find(r => r.x === nextX && r.y === nextY);

            if (!nextRoom) {
            setSystemMessage("No hay nada en esa dirección.");
            return;
        }

        const validation = checkMovementBlock(currentRoom, direction, solvedPuzzleIds, unlockedRoomIds);
            
            if (!validation.canMove) {
            setSystemMessage(validation.message);
            return; // 🛑 El movimiento se detiene aquí si checkMovementBlock dice que no
            }

            // 4. Si todo está bien, mover al jugador
            setCurrentRoomId(nextRoom.id);
            setSystemMessage("");
     };

    const pickUpItem = (item) => {
        if (inventory.length >= 5) {
        setSystemMessage("🧳 ¡Inventario lleno! No puedes cargar más de 5 objetos.");
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
        setSolvedPuzzleIds([...solvedPuzzleIds, puzzle.id]);
        setSystemMessage(puzzle.solvedMessage);

        if (puzzle.rewardItem && inventory.length < 5) {
            setInventory([...inventory, puzzle.rewardItem]);
        }
        } else {
        setSystemMessage("❌ Código incorrecto. Acceso denegado.");
        }
    };

    const useItemFromInventory = (itemId) => {
        const itemPuzzle = currentRoom.itemPuzzle;
        const lock = currentRoom.lock; // Extraemos el candado si la habitación lo tiene
        const item = inventory.find(i => i.id === itemId);

        if (!item) return false;

        // LÓGICA A: ¿Resuelve el puzle de la habitación? (Lo que ya tenías)
        if (itemPuzzle && itemPuzzle.requiredItemId === itemId) {
        if (solvedPuzzleIds.includes(itemPuzzle.id)) {
            setSystemMessage("Esto ya ha sido utilizado aquí.");
            return true;
        }
        setSolvedPuzzleIds([...solvedPuzzleIds, itemPuzzle.id]);
        setSystemMessage(itemPuzzle.solvedMessage);

        if (item.type === "consumable") {
            setInventory(inventory.filter(i => i.id !== itemId));
        }
        return true;
        } 

        // LÓGICA B (NUEVA): ¿Abre la puerta bloqueada?
        if (lock && lock.requiredItem === itemId) {
        if (unlockedRoomIds.includes(currentRoom.id)) {
            setSystemMessage("Ya desbloqueaste este camino, no necesitas usarlo de nuevo.");
            return true;
        }

        // Éxito: Guardamos la habitación como desbloqueada
        setUnlockedRoomIds([...unlockedRoomIds, currentRoom.id]);
        setSystemMessage(lock.unlockedDescription || `¡Éxito! Usaste ${item.name} y desbloqueaste el camino hacia el ${lock.direction}.`);
        
        // Opcional: Si el objeto para abrir la puerta es un consumible (ej. una llave de un solo uso), se gasta.
        if (item.type === "consumable") {
            setInventory(inventory.filter(i => i.id !== itemId));
        }
        return true;
        }
        
        // Si el objeto no sirve ni para puzles ni para candados en esta sala
        setSystemMessage(`No parece que puedas usar ${item.name} en esta área.`);
        return false;
    };

  const isCurrentPuzzleSolved = currentRoom?.puzzle ? solvedPuzzleIds.includes(currentRoom.puzzle.id) : false;
  const isItemPuzzleSolved = currentRoom?.itemPuzzle ? solvedPuzzleIds.includes(currentRoom.itemPuzzle.id) : false;

  return {
    systemMessage,solvedPuzzleIds ,setSystemMessage, movePlayer, pickUpItem, 
    escapeMap, currentRoom, currentRoomId, inventory, collectedItemIds, 
    unlockedRoomIds, isCurrentPuzzleSolved, isItemPuzzleSolved, 
    solveCodePuzzle, useItemFromInventory
  };
}