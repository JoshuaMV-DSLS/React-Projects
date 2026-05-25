// src/hooks/useGameState.js
import { useState } from "react";
import { escapeMap } from "../components/escapeMap.js";

export function useGameState() {
  const [currentRoomId, setCurrentRoomId] = useState(0);
  const [inventory, setInventory] = useState([]); 
  const [collectedItemIds, setCollectedItemIds] = useState([]);
  const [unlockedRoomIds, setUnlockedRoomIds] = useState([]);
  const [solvedPuzzleIds, setSolvedPuzzleIds] = useState([]);
  const [systemMessage, setSystemMessage] = useState("");

  // 🚀 Buscar por ID, no por índice
  const currentRoom = escapeMap.find(room => room.id === currentRoomId) || escapeMap[0];

    const movePlayer = (direction) => {
        const nextRoomId = currentRoom.connections?.[direction];

        if (nextRoomId === undefined) {
        setSystemMessage("Camino bloqueado: Hay una pared.");
        return;
        }
        console.log("¿Habitación desbloqueada?", unlockedRoomIds.includes(currentRoom.id))
        // --- BLOQUEO DE CANDADOS (OBJETOS) ---
        // validacion en unlockedRoomIds
        if (currentRoom.lock) {
        // Si intentas ir hacia la dirección bloqueada y NO está en la lista de desbloqueadas
        if (currentRoom.lock.direction === direction && !unlockedRoomIds.includes(currentRoom.id)) {
            setSystemMessage(currentRoom.lock.lockedDescription);
            return; // 🛑 Denegado
        }}

        // --- BLOQUEO DE PUZLES (CÓDIGO) ---
        if (currentRoom.puzzle) {
        // Puzle bloquea esta dirección si NO está resuelto
        if (currentRoom.puzzle.direction === direction && !solvedPuzzleIds.includes(currentRoom.puzzle.id)) {
            setSystemMessage(currentRoom.puzzle.lockedMessage);
            return; // 🛑 Denegado
        }}

        // --- BLOQUEO DE ENTORNO (PALANCA/ITEMS) ---
        if (currentRoom.itemPuzzle) {
        if (currentRoom.itemPuzzle.direction === direction && !solvedPuzzleIds.includes(currentRoom.itemPuzzle.id)) {
            setSystemMessage(currentRoom.itemPuzzle.lockedMessage);
            return; // 🛑 Denegado
        }}

        // Si pasamos todos los filtros, movemos al jugador
        setCurrentRoomId(nextRoomId);
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

    const isCurrentPuzzleSolved = currentRoom.puzzle ? solvedPuzzleIds.includes(currentRoom.puzzle.id) : false;
    const isItemPuzzleSolved = currentRoom.itemPuzzle ? solvedPuzzleIds.includes(currentRoom.itemPuzzle.id) : false;

  // Devolvemos todo el estado y funciones empaquetadas
  return {
    currentRoom, currentRoomId, inventory, collectedItemIds, unlockedRoomIds, 
    isCurrentPuzzleSolved, isItemPuzzleSolved, systemMessage, 
    setSystemMessage, movePlayer, pickUpItem, solveCodePuzzle, useItemFromInventory
  };
}