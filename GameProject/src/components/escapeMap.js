// EL MAPA:
// src/components/escapeMap.js
export const escapeMap = [
  { 
    id: 0, 
    name: "Room 1 (Celda)", 
    description: "Una celda fría y oscura. El eco de unas tuberías resuena en las paredes.",
    items: [ { id: "key_card_blue", name: "Tarjeta Azul", description: "Acceso de nivel 1" } ],
    connections: { north: 1 }},
  { 
    id: 1, 
    name: "Room 2 (Dormitorio)", 
    description: "Un dormitorio militar abandonado. Hay literas destrozadas y un fuerte olor a óxido.",
    items: [ { id: "crowbar", name: "Palanca de Hierro", description: "Útil para forzar mecanismos" } ],
    connections: { south: 0, east: 2 }},
  { 
    id: 2, 
    name: "Room 3 (Sótano)", 
    description: "El sótano del complejo. Una enorme compuerta hidráulica bloquea el paso hacia el este.",
    connections: { 
      west: 1, 
      east: 4 // Nos llevará a la Room 5 (Mantenimiento), por ejemplo
    },
    // NUEVO: Configuración del obstáculo de la habitación
    lock: {
      direction: "east",
      isLocked: true,
      requiredItem: "crowbar",
      lockedDescription: "La compuerta hidráulica está completamente atascada por el óxido. Necesitas algo con mucha fuerza para hacer palanca.",
      unlockedDescription: "Has forzado la compuerta usando la Palanca de Hierro. Ahora el acceso al este está abierto."
    }},
  { id: 3, name: "Room 4 (Biblioteca)", description: "Una biblioteca llena de archivos quemados.", connections: {} },
  { 
  id: 4, 
  name: "Room 5 (Mantenimiento)", 
  description: "La sala de mantenimiento principal. Hay un panel de energía digital parpadeando en la pared que bloquea un casillero de alta seguridad.", 
  connections: { west: 2 },
  // NUEVO: Configuración del acertijo numérico
  puzzle: {
    id: "panel_energia",
    type: "code",
    solution: "042", // El código de la nota
    isSolved: false,
    rewardItem: { id: "fuses_heavy", name: "Fusibles de Alta Potencia", description: "Esenciales para restaurar la energía del complejo." },
    lockedMessage: "El panel digital requiere un código de acceso de 3 dígitos para desbloquear el casillero.",
    solvedMessage: "¡Código aceptado! El casillero neumático se abre con un siseo, revelando unos fusibles."
  }},
  { id: 5, name: "Room 6 (Pasillo)", description: "Un pasillo de servicio oscuro.", connections: {} }
];