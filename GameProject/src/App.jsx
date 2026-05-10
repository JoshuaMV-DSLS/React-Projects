import { useState,useEffect } from 'react'


function App() {
  const [count, setCount] = useState(0)
  const [time, setTime] = useState(0)

  useEffect(() => {

     if (count<1) {
      setCount(0)
    }
        const interval = setInterval(() => {
            setTime(prevTime => prevTime + 1)
        }, 120)

        return () => clearInterval(interval)
    }, [])


  return (
    <>
      <h1>Welcome to My Game</h1>
        <h2>Time: {time}</h2>
      <button onClick={() => setCount(count + 1)}>Click Me: {count}</button>
    </>
  )
} 
  
export default App
