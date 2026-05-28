// EL MAPA: Aquí definimos la estructura de las habitaciones, sus conexiones, los objetos que contienen, y los puzles asociados a cada una. Este mapa es la base de nuestro juego de escape room.
export const escapeMap = {
  "room1": { 
    id: "room1", 
    x: 1, y: 1, // Posición en la cuadrícula
    connections: { north: "room2" },
    name: "Room 2 (Celdas)",
    description: "Una celda fría y oscura...",
    items: [ { id: "key_card_blue", name: "Tarjeta Azul", description: "Acceso de nivel 1", type: "tool" } ],

  },
 
  "room2": { 
    id: "room2", 
    x: 1, y: 2, // Está al norte de la room1
    connections: { south: "room1", east: "room3" },
    name: "Room 3 (Dormitorio Militar)",
    description: "Un dormitorio militar abandonado...",
    items: [ 
      { id: "crowbar", name: "Palanca de Hierro", description: "Útil para forzar mecanismos", type: "tool" },
      {id: "diario_viejo", name: "Diario polvoriento", description: "Un diario con anotaciones extrañas.", type: "note", content: "En la última página dice: El código de seguridad es 482."},
    ],
  },
  "room3": { 
    id: "room3", 
    x: 2, y: 2, // Está al este de la room2
    connections: { west: "room2", east: "room4" },
    name: "Room 4 (Sótano)",
    description: "El sótano del complejo. Una enorme compuerta hidráulica bloquea el paso hacia el este.",
    lock: {
      direction: "east",
      isLocked: true,
      requiredItem: "crowbar",
      lockedDescription: "La compuerta está atascada...",
      unlockedDescription: "Has forzado la compuerta usando la Palanca de Hierro."
    }
  },
  "room4": { 
    id: "room4", 
        x: 3, y: 2, // Está al este de la room3
    connections: { west: "room3" },
    name: "Room 5 (Mantenimiento)", 
    description: "La sala de mantenimiento principal. Un panel de energía digital requiere un código, y la caja de circuitos principal requiere reparación.", 
    puzzle: {
      id: "panel_energia",
      type: "code",
      solution: "482",
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
    },
  },
};