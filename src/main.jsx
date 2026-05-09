import React from 'react'
import ReactDOM from 'react-dom/client'

// 1. Buscamos el elemento
const rootElement = document.getElementById('root');

// 2. Creamos la raíz de React
const root = ReactDOM.createRoot(rootElement);

// 3. Renderizamos sobre esa raíz
root.render(
  <React.StrictMode>
    <h1>¡Ahora sí funciona! 🚀</h1>
  </React.StrictMode>
);