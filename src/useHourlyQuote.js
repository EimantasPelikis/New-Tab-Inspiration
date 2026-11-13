import { useEffect, useState } from 'react'

const HOUR = 60 * 60 * 1000
const STORAGE_KEY = 'hourly-quote'

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

async function fetchQuote() {
  const res = await fetch('/zenquotes/random')
  if (!res.ok) throw new Error(`ZenQuotes responded ${res.status}`)
  const [item] = await res.json()
  if (!item?.q) throw new Error('Unexpected ZenQuotes response')
  return { text: item.q, author: item.a, fetchedAt: Date.now() }
}

export function useHourlyQuote() {
  const [quote, setQuote] = useState(() => readCache())
  const [error, setError] = useState(null)

  useEffect(() => {
    let timer
    let cancelled = false

    async function refresh() {
      try {
        const next = await fetchQuote()
        if (cancelled) return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        setQuote(next)
        setError(null)
      } catch (err) {
        if (!cancelled) setError(err)
      }
      // Retry in an hour either way; on failure the cached quote stays.
      if (!cancelled) timer = setTimeout(refresh, HOUR)
    }

    // Only fetch immediately if the cached quote is missing or stale.
    const cached = readCache()
    const age = cached ? Date.now() - cached.fetchedAt : Infinity
    if (age >= HOUR) {
      refresh()
    } else {
      timer = setTimeout(refresh, HOUR - age)
    }

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return { quote, error }
}
