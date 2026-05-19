import { useState, useContext} from "react";
import { GameProvider, GameContext } from "./context/GameContext.jsx";
import { escapeMap } from "./components/escapeMap.js";

const useGame = () => useContext(GameContext);


function GameLayout() {
  const { currentRoomId, systemMessage } = useGame();
  const [showMap, setShowMap] = useState(false);

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h1>Escape Room Terminal</h1>
        <p>Explora las instalaciones e interactúa con el entorno.</p>

        <section style={{ marginTop: '20px' }}>  
          <button className="btn-map-toggle" onClick={() => setShowMap(!showMap)}>
            {showMap ? "Cerrar Mapa" : "Ver Mapa"}
          </button>
        </section>

        <section style={{ background: '#1a1d24', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <RoomView />
        </section>

        {systemMessage && (
          <div style={{ 
            background: '#2a1a1a', 
            color: '#ff6b6b', 
            padding: '10px 15px', 
            borderRadius: '4px', 
            marginTop: '15px',
            borderLeft: '4px solid #f56c6c',
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
             {systemMessage}
          </div>
        )}
        <CodeKeypad />
        <InventoryBar />

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

function CodeKeypad() {
  const { currentRoom, solveCodePuzzle, isCurrentPuzzleSolved } = useGame();
  const [digits, setDigits] = useState("");

  // Si no hay puzzle en esta habitación o ya se resolvió, no mostramos el teclado
  if (!currentRoom.puzzle || currentRoom.puzzle.type !== "code" || isCurrentPuzzleSolved) {
    return null;
  }

  const handlePress = (num) => {
    if (digits.length < 3) {
      setDigits(digits + num);
    }
  };

  const handleClear = () => setDigits("");

  const handleSubmit = () => {
    solveCodePuzzle(digits);
    setDigits(""); // Limpiamos pantalla local
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', background: '#222630', borderRadius: '6px', width: '200px' }}>
      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#a0aec0', fontFamily: 'monospace' }}>
        {currentRoom.puzzle.lockedMessage}
      </p>
      
      {/* Pantalla del teclado */}
      <div style={{ 
        background: '#0d1117', color: '#39ff14', padding: '10px', 
        textAlign: 'center', fontFamily: 'monospace', fontSize: '20px', 
        borderRadius: '4px', marginBottom: '10px', letterSpacing: '4px' 
      }}>
        {digits.padEnd(3, "_")}
      </div>

      {/* Grid de Botones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} onClick={() => handlePress(num.toString())} style={{ padding: '10px' }}>{num}</button>
        ))}
        <button onClick={handleClear} style={{ background: '#f56c6c', color: 'white' }}>C</button>
        <button onClick={() => handlePress("0")}>0</button>
        <button onClick={handleSubmit} style={{ background: '#67c23a', color: 'white' }}>OK</button>
      </div>
    </div>
  );
}