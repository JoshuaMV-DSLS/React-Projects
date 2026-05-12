// @ts-ignore
import { useState, useEffect} from "react";

const escapeMap = [
  { id: 0, name: "Room 1", description: "You are in a dark cell room." },
  { id: 1, name: "Room 2", description: "You are in a dormroom." },
  { id: 2, name: "Room 3", description: "You are in a basement room." },
  { id: 3, name: "Room 4", description: "You are in a library room." },
  { id: 4, name: "Room 5", description: "You are in a maintenance room." },
  { id: 5, name: "Room 6", description: "You are in a service hall." }
];

const maze = [Array(10).fill(null)];

function App() {

  const [currentRoomId, setCurrentRoomId] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const currentRoom = escapeMap[currentRoomId];

  // @ts-ignore
  const setCurrentRoom = (roomId) => {
    if (roomId >= 0 && roomId < escapeMap.length) {
      setCurrentRoomId(roomId);
    }
  };

  const handleMapToggle = () => {
    setShowMap((prev) => !prev);
  };

  return (
    <main> 
    <div>
      <h1>Welcome to My Game</h1>
      <p>Use the arrow keys to navigate through the maze.</p>
      <RoomView data={currentRoom} />
          <section>
          <div>
            <button className="btn-map-toggle" onClick={handleMapToggle}>
            Ver Mapa
          </button>
        </div>
      </section>
    </div>
    </main>
  )
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


//@ts-ignore
// @ts-ignore
function MazeMap({ data }) {
  // @ts-ignore
  const onclick = (event) => {
    const roomId = parseInt(event.target.dataset.roomId);
    // @ts-ignore
    setCurrentRoom(roomId);
  }

  return (
    <>
      <h2>Maze Map</h2>
      <div className="maze-map">
        {data.map((
// @ts-ignore
        row, rowIndex) => (
          <div key={rowIndex} className="maze-row">
            {row.map((
// @ts-ignore
            cell, cellIndex) => (
              <div
                key={cellIndex}
                className="maze-cell"
                data-room-id={rowIndex * 10 + cellIndex}
                onClick={onclick}
              >
                {cell ? "X" : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </> 
  );
}

export default App;