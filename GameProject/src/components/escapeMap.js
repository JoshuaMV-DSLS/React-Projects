// EL MAPA: Aquí definimos la estructura de las habitaciones, sus conexiones, los objetos que contienen, y los puzles asociados a cada una. Este mapa es la base de nuestro juego de escape room.
export const escapeMap = [
  { 
    id: 0, 
    name: "Room 1 (Celda)", 
    description: "Una celda fría y oscura...",
    items: [ { id: "key_card_blue", name: "Tarjeta Azul", description: "Acceso de nivel 1", type: "tool" } ],
    connections: { north: 1 }
  },
  { 
    id: 1, 
    name: "Room 2 (Dormitorio)", 
    description: "Un dormitorio militar abandonado...",
    items: [ { id: "crowbar", name: "Palanca de Hierro", description: "Útil para forzar mecanismos", type: "tool" } ],
    connections: { south: 0, east: 2 }
  },
  { 
    id: 2, 
    name: "Room 3 (Sótano)", 
    description: "El sótano del complejo. Una enorme compuerta hidráulica bloquea el paso hacia el este.",
    connections: { west: 1, east: 4 },
    lock: {
      direction: "east",
      isLocked: true,
      requiredItem: "crowbar",
      lockedDescription: "La compuerta está atascada...",
      unlockedDescription: "Has forzado la compuerta usando la Palanca de Hierro."
    }
  },
  { 
    id: 4, 
    name: "Room 5 (Mantenimiento)", 
    description: "La sala de mantenimiento principal. Un panel de energía digital requiere un código, y la caja de circuitos principal requiere reparación.", 
    connections: { west: 2 },
    puzzle: {
      id: "panel_energia",
      type: "code",
      solution: "042",
      rewardItem: { id: "fuses_heavy", name: "Fusibles", description: "Fusibles de alta potencia.", type: "consumable" },
      lockedMessage: "El panel digital requiere un código de acceso de 3 dígitos.",
      solvedMessage: "¡Código aceptado! El casillero se abre revelando unos fusibles."
    },
    // NUEVO PUZLE: Requiere el uso directo de un ítem del inventario
    itemPuzzle: {
      id: "caja_fusibles",
      requiredItemId: "fuses_heavy", // El ítem que el jugador debe "Usar" aquí
      isSolved: false,
      lockedMessage: "La caja de circuitos principal está vacía. Necesita fusibles de alta potencia para restaurar la luz del complejo.",
      solvedMessage: "🔋 ¡Fusibles instalados! Los generadores rugen y la energía del complejo se ha restaurado por completo. ¡Has escapado!"
    }
  }
];