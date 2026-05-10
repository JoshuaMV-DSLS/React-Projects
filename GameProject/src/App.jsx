
const maze = [Array(10).fill(null), Array(10).fill(null), Array(10).fill(null), Array(10).fill(null), Array(10).fill(null), Array(10).fill(null), Array(10).fill(null), Array(10).fill(null), Array(10).fill(null), Array(10).fill(null)]

function App() {
  return (
    <main> 
    <div>
      <h1>Welcome to My Game</h1>
      <p>Use the arrow keys to navigate through the maze.</p>
    </div>
    <div> 
      <h2>Maze</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`, gap: '5px' }}>
        {maze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div key={`${rowIndex}-${cellIndex}`} style={{ width: '30px', height: '30px', backgroundColor: 'lightgray', border: '1px solid black' }}></div>
          ))
        )}
      </div>
    </div>
    </main>
  )
}
export default App
