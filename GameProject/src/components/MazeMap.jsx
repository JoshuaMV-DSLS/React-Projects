import React from "react";
import { useGameState } from "../Hooks/useGameState.js"; // Ajusta la ruta a tu hook
import { escapeMap } from "./escapeMap.js";    // Ajusta la ruta a tu mapa

export function MazeMap() {
  const { currentRoom } = useGameState();

  // 1. AUTOMÁTICO: En lugar de adivinar el rango, calculamos el tamaño real del mapa
  const roomsArray = Object.values(escapeMap);
  const xValues = roomsArray.map(r => Number(r.x));
  const yValues = roomsArray.map(r => Number(r.y));

  // Encontramos los límites mínimos y máximos de tus coordenadas reales
  const minX = Math.min(...xValues, 0);
  const maxX = Math.max(...xValues, 3);
  const minY = Math.min(...yValues, 0);
  const maxY = Math.max(...yValues, 3);

  // Generamos los arreglos para las filas y columnas exactas que usas
  const xRange = [];
  for (let i = minX; i <= maxX; i++) xRange.push(i);
  
  const yRange = [];
  for (let i = minY; i <= maxY; i++) yRange.push(i);

  if (!currentRoom) return null;

  return (
    <div className="map-container">
      <h3 style={{ marginBottom: "15px", color: "var(--accent-color)", textAlign: "center" }}>
        📍 TERMINAL DE MAPEO
      </h3>
      
      <div className="map-grid" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {yRange.map((y) => (
          <div key={y} className="map-row" style={{ display: "flex", gap: "6px" }}>
            {xRange.map((x) => {
              // 2. CORRECCIÓN DE PIN: Comparamos forzando a tipo Número para evitar errores de JS
              const room = roomsArray.find(
                (r) => Number(r.x) === x && Number(r.y) === y
              );

              if (!room) {
                // Mantiene el hueco vacío en la cuadrícula para que no se desalineen las salas
                return (
                  <div 
                    key={x} 
                    className="map-node empty" 
                    style={{ opacity: 0.1, border: "1px dashed #333", cursor: "default" }} 
                  />
                );
              }

              // 3. Verificamos si el jugador está AQUÍ (Comparando IDs estrictos)
              const isCurrent = currentRoom.id === room.id;

              // Convertimos el ID "room5" en "R5" para limpiar la UI
              const shortName = room.id.toUpperCase().replace("ROOM", "R");

              let nodeClasses = "map-node";
              if (isCurrent) nodeClasses += " current";

              return (
                <div key={x} className={nodeClasses}>
                  {/* Nombre simplificado (R1, R2, R3...) */}
                  <span style={{ fontInverse: true, fontWeight: "bold" }}>{shortName}</span>
                  
                  {/* El pin solo si coincide la sala actual */}
                  {isCurrent && (
                    <span className="player-pin" style={{ position: "absolute", top: "2px", right: "4px" }}>
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