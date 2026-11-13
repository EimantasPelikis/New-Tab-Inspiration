import { useEffect, useState } from 'react'
import './App.css'
import { useHourlyQuote } from './useHourlyQuote'

const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

// hourCycle 'h23' avoids Chrome rendering midnight as "24:00:00".
const timeFormat = new Intl.DateTimeFormat([], {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

const pad = (n) => String(n).padStart(2, '0')

// Ticks on the second boundary and stops while the tab is hidden.
function useNow() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer

    function tick() {
      setNow(new Date())
      timer = setTimeout(tick, 1000 - (Date.now() % 1000))
    }

    function onVisibility() {
      clearTimeout(timer)
      if (!document.hidden) tick()
    }

    timer = setTimeout(tick, 1000 - (Date.now() % 1000))
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return now
}

function App() {
  const now = useNow()
  const { quote, error } = useHourlyQuote()

  const date = dateFormat.format(now)
  const time = timeFormat.format(now)
  const isoDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const isoTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  return (
    <main className="app">
      <section className="card date-card">
        <p className="label">Today's date</p>
        <h1>
          <time dateTime={isoDate}>{date}</time>
        </h1>
      </section>
      <section className="card time-card" aria-label="Current time">
        <p className="time">
          <time dateTime={isoTime}>{time}</time>
        </p>
      </section>
      <section className="card quote-card" aria-label="Quote">
        {quote ? (
          <figure>
            <blockquote>{quote.text}</blockquote>
            <figcaption className="author">— {quote.author}</figcaption>
          </figure>
        ) : (
          <p className="author" role="status">
            {error ? 'Quote unavailable right now.' : 'Loading quote…'}
          </p>
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
