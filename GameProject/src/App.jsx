import { useState } from 'react'
import Timer from './components/timer'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Welcome to My Game</h1>
      <Timer />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </>
  )
} 
  
export default App
