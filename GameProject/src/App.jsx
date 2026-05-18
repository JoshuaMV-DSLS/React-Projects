import { useState, useContext} from "react";
import { GameProvider, GameContext } from "./context/GameContext.jsx";
import { escapeMap } from "./components/escapeMap.js";

const useGame = () => useContext(GameContext);


function GameLayout() {
  const { currentRoomId } = useGame();
  const [showMap, setShowMap] = useState(false);

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h1>Escape Room Terminal</h1>
        <p>Explora las instalaciones e interactúa con el entorno.</p>
        
        <InventoryBar />

        <section style={{ background: '#1a1d24', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <RoomView />
        </section>
          
        <section style={{ marginTop: '20px' }}>  
          <button className="btn-map-toggle" onClick={() => setShowMap(!showMap)}>
            {showMap ? "Cerrar Mapa" : "Ver Mapa"}
          </button>
        </section>

        {showMap && <MazeMap currentId={currentRoomId} />}
      </div>
    </main>
  );
}

//---------------------------
// ---------- APP ----------
//---------------------------

export default function App() {
  return (
    <GameProvider>
      <GameLayout />
    </GameProvider>
  );
}

//----------------------------------------------
// ---------- COMPONENTES SECUNDARIOS ----------
//----------------------------------------------

// @ts-ignore
function RoomView() {
  const { currentRoom, collectedItemIds, pickUpItem } = useGame();
  const availableItems = currentRoom.items?.filter(item => !collectedItemIds.includes(item.id)) || [];

  return (
    <>
      <h2>{currentRoom.name}</h2>
      <p>{currentRoom.description}</p>
      
      {availableItems.length > 0 && (
        <div style={{ margin: '15px 0', padding: '10px', border: '1px dashed #555' }}>
          <p style={{ color: '#E6A23C' }}>👁️ Objetos en el área:</p>
          {availableItems.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span><strong>{item.name}</strong> - {item.description}</span>
              <button onClick={() => pickUpItem(item)}>Recoger</button>
            </div>
          ))}
        </div>
      )}

      <NavigationControls />
    </>
  );
}

// @ts-ignore
function NavigationControls() {
  const { currentRoom, movePlayer } = useGame();
  const connections = currentRoom.connections;

  if (!connections) return null;

  return (
    <div className="navigation-ui" style={{ marginTop: '20px' }}>
      {connections.north !== undefined && <button onClick={() => movePlayer('north')}>Norte ↑</button>}
      <div className="east-west-row" style={{ display: 'flex', gap: '10px', margin: '5px 0' }}>
        {connections.west !== undefined && <button onClick={() => movePlayer('west')}>← Oeste</button>}
        {connections.east !== undefined && <button onClick={() => movePlayer('east')}>Este →</button>}
      </div>
      {connections.south !== undefined && <button onClick={() => movePlayer('south')}>Sur ↓</button>}
    </div>
  );
}

// @ts-ignore
function MazeMap({ currentId }) {
  return (
    <div className="maze-container">
      <h3>MAPA DEL COMPLEJO</h3>
      <div className="maze-grid">
        {escapeMap.map((room) => (
          <div key={room.id} className={"map-node " + (room.id === currentId ? 'current' : '')}>
            {room.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryBar() {
  const { inventory } = useGame();
  return (
    <div style={{ background: '#11141a', padding: '15px', borderRadius: '4px', border: '1px solid #333' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#888' }}>INVENTARIO</h3>
      <div style={{ display: 'flex', gap: '15px' }}>
        {[0, 1].map(index => {
          const item = inventory[index];
          return (
            <div key={index} style={{
              width: '120px', height: '50px', border: '1px solid #444', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '12px',
              background: item ? 'rgba(103, 194, 58, 0.1)' : 'transparent',
              borderColor: item ? '#67C23A' : '#444'
            }}>
              {item ? item.name : "[ Vacío ]"}
            </div>
          );
        })}
      </div>
    </div>
  );
}