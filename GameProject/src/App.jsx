// @ts-ignore
// @ts-ignore
import { useState, useEffect } from "react";

const escapeMap = [
  { id: 0, name: "Room 1", description: "You are in a dark cell room." },
  { id: 1, name: "Room 2", description: "You are in a dormroom." },
  { id: 2, name: "Room 3", description: "You are in a basement room." },
  { id: 3, name: "Room 4", description: "You are in a library room." },
  { id: 4, name: "Room 5", description: "You are in a maintenance room." },
  { id: 5, name: "Room 6", description: "You are in a service hall." }
];

function App() {
  const [currentRoomId, setCurrentRoomId] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const currentRoom = escapeMap[currentRoomId];

  // @ts-ignore
  const handleRoomSelect = (id) => {
    setCurrentRoomId(id);
    setShowMap(false); // Cerramos el mapa al elegir habitación
  };

  const handleMapToggle = () => {
    setShowMap(!showMap);
  };

  return (
    <main>
      <div>
        <h1>Welcome to My Game</h1>
        <p>Explore the facility and find the exit.</p>
        
        {/* Mostramos la vista de la habitación actual */}
        <RoomView data={currentRoom} />

        <section>
          <button className="btn-map-toggle" onClick={handleMapToggle}>
            {showMap ? "Cerrar Mapa" : "Ver Mapa"}
          </button>
        </section>

        {/* LÓGICA DEL MAPA: Solo se renderiza si showMap es true */}
        {showMap && (
          <MazeMap 
            data={escapeMap} 
            currentId={currentRoomId} 
            onSelect={handleRoomSelect} 
          />
        )}
      </div>
    </main>
  );
}

// Componente del Mapa
// @ts-ignore
function MazeMap({ data, currentId, onSelect }) {
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
            onClick={() => onSelect(room.id)}
          >
            {room.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// @ts-ignore
function RoomView({ data }) {
  return (
    <section>
      <h3>{data.name}</h3>
      <p>{data.description}</p>
    </section>
  );
}

export default App;