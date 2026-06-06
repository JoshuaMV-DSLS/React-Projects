/**
 * Centraliza todas las reglas de bloqueo del juego.
 * Retorna un objeto con el permiso y el mensaje correspondiente.
 */
export function checkMovementBlock(currentRoom, direction, solvedPuzzleIds, unlockedRoomIds) {
    
  const moveDir = direction.toLowerCase();

  // 1. Bloqueo de puzle numérico/código (Tipo: puzzle)
  if (currentRoom.puzzle?.direction) {
    const puzzleDir = currentRoom.puzzle.direction.toLowerCase();
    if (puzzleDir === moveDir && !solvedPuzzleIds.includes(currentRoom.puzzle.id)) {
      return { canMove: false, message: currentRoom.puzzle.lockedMessage };
    }
  }

  // 2. Bloqueo de puzle de inventario/uso de objeto (Tipo: itemPuzzle)
  if (currentRoom.itemPuzzle?.direction) {
    const itemPuzzleDir = currentRoom.itemPuzzle.direction.toLowerCase();
    if (itemPuzzleDir === moveDir && !solvedPuzzleIds.includes(currentRoom.itemPuzzle.id)) {
      return { canMove: false, message: currentRoom.itemPuzzle.lockedMessage };
    }
  }

  // 3. Bloqueo de entorno / Candados mecánicos (Tipo: lock)
  if (currentRoom.lock?.direction) {
    const lockDir = currentRoom.lock.direction.toLowerCase();
    if (lockDir === moveDir && !unlockedRoomIds.includes(currentRoom.id)) {
      return { 
        canMove: false, 
        message: currentRoom.lock.lockedDescription || "El camino está bloqueado." 
      };
    }
  }

  // Si pasa todos los filtros, el camino está libre
  return { canMove: true, message: "" };
}