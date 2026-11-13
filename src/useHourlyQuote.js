import { useEffect, useState } from 'react'

const HOUR = 60 * 60 * 1000
const RETRY_DELAY = 5 * 60 * 1000
const FETCH_TIMEOUT = 10 * 1000
const STORAGE_KEY = 'hourly-quote'

// Extension pages use chrome.storage.local (shared across tabs, async). Under
// `npm run dev` there is no chrome.* API, so fall back to localStorage.
const chromeStorage =
  typeof chrome !== 'undefined' && chrome.storage?.local ? chrome.storage.local : null

async function readCache() {
  try {
    if (chromeStorage) {
      const result = await chromeStorage.get(STORAGE_KEY)
      return result[STORAGE_KEY] ?? null
    }
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

async function writeCache(value) {
  try {
    if (chromeStorage) await chromeStorage.set({ [STORAGE_KEY]: value })
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Caching is best-effort; the quote still displays.
  }
}

// Dev uses the Vite proxy (ZenQuotes sends no CORS headers). Built output runs
// as a Chrome extension page, where host_permissions allow the direct request.
const QUOTE_URL = import.meta.env.DEV
  ? '/zenquotes/random'
  : 'https://zenquotes.io/api/random'

async function fetchQuote(signal) {
  const res = await fetch(QUOTE_URL, { signal })
  if (!res.ok) throw new Error(`ZenQuotes responded ${res.status}`)
  const [item] = await res.json()
  if (!item?.q) throw new Error('Unexpected ZenQuotes response')
  return { text: item.q, author: item.a, fetchedAt: Date.now() }
}

export function useHourlyQuote() {
  const [quote, setQuote] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let timer
    let cancelled = false
    let controller = null

    function schedule(ms) {
      clearTimeout(timer)
      timer = setTimeout(check, ms)
    }

    async function refresh() {
      if (controller) return // a request is already in flight
      controller = new AbortController()
      const { signal } = controller
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
      try {
        const next = await fetchQuote(signal)
        if (cancelled) return
        await writeCache(next)
        setQuote(next)
        setError(null)
        schedule(HOUR)
      } catch (err) {
        if (cancelled) return
        // Keep the cached quote and retry sooner than the normal interval.
        setError(err)
        schedule(RETRY_DELAY)
      } finally {
        clearTimeout(timeout)
        controller = null
      }
    }

    // Show the cached quote, and fetch only if it is missing or stale.
    async function check() {
      const cached = await readCache()
      if (cancelled) return
      if (cached) setQuote(cached)
      const age = cached ? Date.now() - cached.fetchedAt : Infinity
      if (age >= HOUR) refresh()
      else schedule(HOUR - age)
    }

    // Timers are throttled in background tabs and don't survive sleep, so
    // re-check staleness when the tab becomes visible or the network returns.
    function onVisibility() {
      if (!document.hidden) check()
    }

    // Another tab may have fetched a newer quote; adopt it instead of refetching.
    function onStorageChanged(changes, area) {
      if (area === 'local' && changes[STORAGE_KEY]) check()
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('online', check)
    if (chromeStorage) chrome.storage.onChanged.addListener(onStorageChanged)
    check()

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller?.abort()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('online', check)
      if (chromeStorage) chrome.storage.onChanged.removeListener(onStorageChanged)
    }
  }, [])

  return { quote, error }
}
