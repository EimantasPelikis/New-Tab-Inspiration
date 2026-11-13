import { useEffect, useState } from 'react'
import './App.css'
import { useHourlyQuote } from './useHourlyQuote'

function App() {
  const [now, setNow] = useState(new Date())
  const { quote, error } = useHourlyQuote()

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
      <section className="card date-card">
        <p className="label">Today's date</p>
        <h1>{date}</h1>
      </section>
      <section className="card time-card">
        <p className="time">{time}</p>
      </section>
      <section className="card quote-card">
        {quote ? (
          <>
            <blockquote>{quote.text}</blockquote>
            <p className="author">— {quote.author}</p>
          </>
        ) : (
          <p className="author">{error ? 'Quote unavailable right now.' : 'Loading quote…'}</p>
        )}
      </section>
      <p className="attribution">
        Inspirational quotes provided by{' '}
        <a href="https://zenquotes.io/" target="_blank" rel="noreferrer">
          ZenQuotes API
        </a>
      </p>
    </main>
  )
}

export default App
