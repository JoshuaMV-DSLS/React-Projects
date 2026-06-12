import { useState, useContext } from "react";
import { GameProvider, GameContext } from "./context/GameContext.jsx";
import { escapeMap } from "./components/escapeMap.js";
import { MazeMap } from "./components/MazeMap.jsx";

const useGame = () => useContext(GameContext);

function GameLayout() {
  const { currentRoomId, systemMessage } = useGame();
  const [showMap, setShowMap] = useState(false);

  return (
    <main className="body">
      <div>
        <section className="header-section"> 
          <div>
            <p className="header-title">Escape Room Terminal</p>
            <q>Explora las instalaciones e interactúa con el entorno.</q> 
          </div>      
          <button className="btn-map-toggle" onClick={() => setShowMap(!showMap)}>
            {showMap ? "Cerrar Mapa" : "Ver Mapa"}
          </button>
        </section>

        <section className="room-section">
          <RoomView />
        </section>

        {systemMessage && (
          <div className="sysmessage">
             {systemMessage}
          </div>
        )}
        
        <InventoryBar />

        {showMap && (
        <div className="modal-overlay" onClick={() => setShowMap(false)}>
          {/* El stopPropagation evita que el modal se cierre al hacer clic DEntro del mapa */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowMap(false)}>
              ✖
            </button>
            <MazeMap />
          </div>
        </div>
      )}
       
      </div>
    </main>
  );
}

// ---------- APP ----------

export default function App() {
  return (
    <GameProvider>
      <GameLayout />
    </GameProvider>
  );
}

// ---------- COMPONENTES SECUNDARIOS ----------

function RoomView() {
  // 1. Usamos EXACTAMENTE el mismo hook que GameLayout para no romper el estado
  const { 
    currentRoom, collectedItemIds = [], pickUpItem, solvedPuzzleIds = [], isItemPuzzleSolved } = useGame();

  // Protección por si la habitación tarda en cargar
  if (!currentRoom) return <p>Cargando habitación...</p>;

  // 2. Usamos tu lógica original para filtrar los ítems del suelo
  const availableItems = currentRoom.items?.filter(item => !collectedItemIds.includes(item.id)) || [];

  // 3. Mecánica de Oscuridad: Si la sala requiere energía y los fusibles NO están resueltos
  const isRoomDark = currentRoom.requiresPower && !solvedPuzzleIds.includes("caja_fusibles");

  console.log("¿La sala requiere energía?:", currentRoom.requiresPower);
  console.log("Lista de puzles resueltos actualmente:", solvedPuzzleIds);
  console.log("¿Está oscuro?:", isRoomDark);

  return (
    <div className={`room-view-wrapper ${isRoomDark ? 'room-dark' : ''}`}>
      <h2>{currentRoom.name}</h2>
      
      {/* Descripción dinámica según la luz */}
      <p className="room-description">
        {isRoomDark ? currentRoom.darkDescription : currentRoom.description}
      </p>

      {/* Indicador visual del puzle de la habitación */}
      {currentRoom.itemPuzzle && (
        <div className={`puzzle-status-box ${isItemPuzzleSolved ? 'solved' : 'locked'}`}>
          <p className="puzzle-status-text">
            {isItemPuzzleSolved ? "⚙️ ESTATUS: ENERGÍA RESTAURADA" : `⚙️ ESTATUS: ${currentRoom.itemPuzzle.lockedMessage}`}
          </p>
        </div>
      )}
      
      {/* Items en el suelo dependientes de la luz */}
      {isRoomDark ? (
        <div className="dark-notice-box">
          <p className="text-warning">✨ No puedes buscar objetos en la absoluta oscuridad. Necesitas restablecer la energía.</p>
        </div>
      ) : (
        availableItems.length > 0 && (
          <div className="floor-items-container">
            <h3>Objetos en el suelo</h3>
            <div className="floor-items-grid">
              {availableItems.map(item => (
                <div key={item.id} className="floor-item-card">
                  <strong className="floor-item-title">{item.name}</strong>
                  {item.description && <span className="floor-item-desc">{item.description}</span>}
                  <button onClick={() => pickUpItem(item)} className="btn-pickup">Recoger</button>
                </div>
              ))}
            </div>
          </div>
        )
      )}
      
      {/* Controles del entorno */}
      <CodeKeypad />
      <NavigationControls />
    </div>
  );
}

function NavigationControls() {
  const { currentRoom, movePlayer } = useGame();
  
  // Usamos la importación directa si escapeMap del contexto es undefined
  const mapData = escapeMap; 

  if (!currentRoom || !mapData) return null;

  const canMove = (direction) => {
    let checkX = currentRoom.x;
    let checkY = currentRoom.y;
    if (direction === 'north') checkY -= 1;
    if (direction === 'south') checkY += 1;
    if (direction === 'west')  checkX -= 1;
    if (direction === 'east')  checkX += 1;

    return Object.values(mapData).some(room => room.x === checkX && room.y === checkY);
  };

  return (
    <div className="navigation-ui">
      {canMove('north') && <button onClick={() => movePlayer('north')}>Norte ↑</button>}
      <div className="east-west-row">
        {canMove('west')  && <button onClick={() => movePlayer('west')}>← Oeste</button>}
        {canMove('east')  && <button onClick={() => movePlayer('east')}>Este →</button>}
      </div>
      {canMove('south') && <button onClick={() => movePlayer('south')}>Sur ↓</button>}
    </div>
  );
}


function InventoryBar() {
  const { inventory, useItemFromInventory } = useGame();
  const [activeItem, setActiveItem] = useState(null);

  const handleUseItem = (item) => {
    useItemFromInventory(item.id);
    setActiveItem(null);
  };

  const getItemLabel = (type) => {
    switch (type) {
      case "tool": return "🔧 Herramienta";
      case "note": return "📜 Documento";
      case "consumable": return "🔋 Consumible";
      default: return "📦 Objeto";
    }
  };

  return (
    <div className="inventory-grid-container">
      <h3 className="inventory-title">INVENTARIO ({inventory.length} / 5)</h3>
      
      <div className="inventory">
        {Array.from({ length: 5 }).map((_, index) => {
          const item = inventory[index];
          const hasItemClass = item ? 'inventory-has-item has-cursor' : 'inventory-is-empty';

          return (
            <div 
              key={index} 
              className={`inventory-item ${hasItemClass}`}
              onClick={() => item && setActiveItem(item)}
            >
              {item ? (
                <div className="inventory-item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-label">{getItemLabel(item.type)}</span>
                </div>
              ) : (
                <span className="empty-slot-text">[ Vacío ]</span>
              )}
            </div>
          );
        })}
      </div>

      {/* POP-UP (MODAL OVERLAY) */}
      {activeItem && (
        <div className="modal-overlay"> 
          <div className="modal-content">
            <span className="active-item-type">{getItemLabel(activeItem.type)}</span>
            
            <h2 className="active-item-name">{activeItem.name}</h2>
            <p className="active-item-description">{activeItem.description}</p>
            
            {activeItem.type === "note" && (
              <div className="note-content-box">
                <p><em>"{activeItem.content}"</em></p>
              </div>
            )}

            <div className="modal-buttons-container">
              {activeItem.type !== "note" && (
                <button onClick={() => handleUseItem(activeItem)} className="btn-action btn-use">
                  Usar
                </button>
              )}
              <button onClick={() => setActiveItem(null)} className="btn-action btn-close">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CodeKeypad() {
  const { currentRoom, solveCodePuzzle, isCurrentPuzzleSolved } = useGame();
  const [digits, setDigits] = useState("");

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
    setDigits("");
  };

  return (
    <div className="keypad-container">
      <p className="keypad-message">
        {currentRoom.puzzle.lockedMessage}
      </p>
      
      <div className="num-pad" data-active={true}>
        {digits.padEnd(3, "_")}
      </div>

      <div className="keypad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} className="btn-keypad-num" onClick={() => handlePress(num.toString())}>{num}</button>
        ))}
        <button className="btn-keypad-clear" onClick={handleClear}>C</button>
        <button className="btn-keypad-num" onClick={() => handlePress("0")}>0</button>
        <button className="btn-keypad-ok" onClick={handleSubmit}>OK</button>
      </div>
    </div>
  );
}