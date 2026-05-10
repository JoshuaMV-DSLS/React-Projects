import { useState, useEffect } from 'react'

export const Timer = () => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h2>Timer: {time}</h2>
    </div>
  )
}

export default Timer