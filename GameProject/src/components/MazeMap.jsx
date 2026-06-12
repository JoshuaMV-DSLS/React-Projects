import React from "react";
import { useGameState } from "../Hooks/useGameState.js"; // Ajusta la ruta a tu hook
import { escapeMap } from "./escapeMap.js";    // Ajusta la ruta a tu mapa

export function MazeMap() {
  // El mapa se autoabastece del estado global del juego 🧠
  const { currentRoom, solvedPuzzleIds = [] } = useGameState();

  // Rangos de tu mapa basados en tus coordenadas X e Y
  const xRange = [1, 2, 3];
  const yRange = [0, 1, 2];

  if (!currentRoom) return null;

  return (
    <div className="map-container">
      <h3 style={{ marginBottom: "10px", color: "var(--accent-color)" }}>
        📍 Terminal de Mapeo
      </h3>
      
      <div className="map-grid" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {yRange.map((y) => (
          <div key={y} className="map-row" style={{ display: "flex", gap: "8px" }}>
            {xRange.map((x) => {
              // 1. Buscamos si existe una habitación en esta coordenada
              const room = Object.values(escapeMap).find((r) => r.x === x && r.y === y);

              if (!room) {
                // Si no hay habitación, pintamos un espacio vacío para mantener la cuadrícula alineada
                return (
                  <div 
                    key={x} 
                    style={{ width: "100px", height: "80px", opacity: 0 }} 
                  />
                );
              }

              // 2. Evaluamos los estados usando condiciones estrictas
              const isCurrent = currentRoom.id === room.id;
              
              // Es "solved" si el puzle de esta habitación específica está en la lista de resueltos
              const isSolved = room.puzzle?.id && solvedPuzzleIds.includes(room.puzzle.id);

              // 3. Construimos dinámicamente tus clases CSS
              let nodeClasses = "map-node";
              if (isCurrent) nodeClasses += " current";
              if (isSolved)  nodeClasses += " solved";

              return (
                <div key={x} className={nodeClasses}>
                  {/* Nombre de la habitación */}
                  <span>{room.name}</span>
                  
                  {/* El pin solo aparece si es la habitación actual exacta */}
                  {isCurrent && (
                    <span style={{ position: "absolute", top: "4px", right: "4px" }}>
                      📍
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}