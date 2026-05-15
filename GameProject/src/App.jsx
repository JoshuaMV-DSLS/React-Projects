import { useState } from "react";

// EL MAPA:
const escapeMap = [
  { 
    id: 0, 
    name: "Room 1", 
    description: "You are in a dark cell room.",
    puzzle: { type:"circuit", solved: false, difficulty: "medium" },
    items: [ { id: "key_card_blue", name: "Tarjeta Azul", description: "Acceso nivel 1" } ],
    interactions: [ { id: "note_01", text: "La nota dice: 'El orden es 0-4-2'." } ],
    connections: { north: 1 } // Lleva a Room 2
  },
  { 
    id: 1, 
    name: "Room 2", 
    description: "You are in a dormroom.",
    connections: { south: 0, east: 2 } // Regresa a Room 1, o va a Room 3
  },
  { 
    id: 2, 
    name: "Room 3", 
    description: "You are in a basement room.",
    connections: { west: 1 } // Regresa a Room 2
  },
  { id: 3, name: "Room 4", description: "You are in a library room.", connections: {} },
  { id: 4, name: "Room 5", description: "You are in a maintenance room.", connections: {} },
  { id: 5, name: "Room 6", description: "You are in a service hall.", connections: {} }
];

//---------------------------
// ---------- APP ----------
//---------------------------

export default function App() {
  const [currentRoomId, setCurrentRoomId] = useState(0);
  const [showMap, setShowMap] = useState(false);
  
  const currentRoom = escapeMap[currentRoomId];

  // FUNCIÓN DE MOVIMIENTO
  // @ts-ignore
  const handleMove = (direction) => {
    // Buscar la conexión entre room con la dirección
    // @ts-ignore
    const nextRoomId = currentRoom.connections?.[direction];

    if (nextRoomId !== undefined) {
      console.log(`Moviendo a la habitación: ${nextRoomId}`);
      setCurrentRoomId(nextRoomId);
    } else {
      console.log("Camino bloqueado o pared en dirección:", direction);
    }
  };

  const handleMapToggle = () => {
    setShowMap(!showMap);
  };

  return (
    <main>
      <div>
        <h1>Welcome to My Game</h1>
        <p>Explore the facility and find the exit.</p>
        
        <section style={{ marginTop: '20px' }}>  
          <button className="btn-map-toggle" onClick={handleMapToggle}>
            {showMap ? "Cerrar Mapa" : "Ver Mapa"}
          </button>
        </section>

        <section>
          {/*PASAR DATOS DE LA HABITACIÓN COMPLETA Y LA FUNCIÓN DE MOVIMIENTO */}
          <RoomView room={currentRoom} onMove={handleMove} />
        </section>

        {showMap && (
          <MazeMap 
            data={escapeMap} 
            currentId={currentRoomId} 
          />
        )}
      </div>
    </main>
  );
}

//----------------------------------------------
// ---------- COMPONENTES SECUNDARIOS ----------
//----------------------------------------------

// @ts-ignore
function RoomView({ room, onMove }) {
  return (
    <>
      <section>
        <h2>{room.name}</h2>
        <p>{room.description}</p>
        {/*  Si existe pista en esta habitación se muestra*/}
        {room.interactions && <p><strong>Pista:</strong> {room.interactions[0].text}</p>}
      </section>
      
      {/* Pasa las conexiones y la función a los controles */}
      <NavigationControls connections={room.connections} onMove={onMove} />
    </>
  );
}

// @ts-ignore
function NavigationControls({ connections, onMove }) {
  // No se muestran contoles si la habitación no tiene conexiones definidas
  if (!connections) return null;

  return (
    <div className="navigation-ui" style={{ marginTop: '15px' }}>
      {connections.north !== undefined && 
        <button onClick={() => onMove('north')}>Norte ↑</button>}
      
      <div className="east-west-row" style={{ display: 'flex', gap: '10px', margin: '5px 0' }}>
        {connections.west !== undefined && 
          <button onClick={() => onMove('west')}>← Oeste</button>
        }
        
        {connections.east !== undefined && 
          <button onClick={() => onMove('east')}>Este →</button>}
      </div>

      {connections.south !== undefined && 
        <button onClick={() => onMove('south')}>Sur ↓</button>}
    </div>
  );
}

// @ts-ignore
function MazeMap({ data, currentId }) {
  return (
    <div className="maze-container">
      <h3>MAPA DEL COMPLEJO</h3>
      <div className="maze-grid">
        {data.map((
// @ts-ignore
        room) => (
          <div
            key={room.id}
            className={"map-node " + (room.id === currentId ? 'current' : '')}
          >
            {room.name}
          </div>
        ))}
      </div>
    </div>
  );
}