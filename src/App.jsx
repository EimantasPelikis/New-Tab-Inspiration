import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const date = now.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const time = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  return (
    <main className="app">
      <p className="label">Today's date</p>
      <h1>{date}</h1>
      <p className="time">{time}</p>
    </main>
  )
}

export default App
