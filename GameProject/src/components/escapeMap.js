// EL MAPA:
export const escapeMap = [
  { 
    id: 0, 
    name: "Room 1 (Celda)", 
    description: "Una celda fría y oscura. El eco de unas tuberías resuena en las paredes.",
    items: [ { id: "key_card_blue", name: "Tarjeta Azul", description: "Acceso de nivel 1" } ],
    connections: { north: 1 }
  },
  { 
    id: 1, 
    name: "Room 2 (Dormitorio)", 
    description: "Un dormitorio militar abandonado. Hay literas destrozadas y un fuerte olor a óxido.",
    items: [ { id: "crowbar", name: "Palanca de Hierro", description: "Útil para forzar mecanismos" } ],
    connections: { south: 0, east: 2 }
  },
  { 
    id: 2, 
    name: "Room 3 (Sótano)", 
    description: "El sótano del complejo. Una enorme compuerta hidráulica bloquea el paso hacia el este.",
    connections: { west: 1 }
  }
];