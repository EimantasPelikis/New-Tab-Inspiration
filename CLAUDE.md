# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (the `/zenquotes` proxy only works here)
- `npm run build` — production build into `dist/`, which is the Chrome extension (load it via `chrome://extensions` → Load unpacked)
- `npm run preview` — serve the build over http (the built app calls ZenQuotes directly, which fails CORS outside the extension)
- `npm run lint` — oxlint (`react/rules-of-hooks` is an error; `react/only-export-components` warns)

There is no test setup.

## Architecture

Single-page React 19 + Vite app (plain JS/JSX, no TypeScript) that shows the current date, a live clock, and an hourly-refreshed quote. It is packaged as a Chrome extension that overrides the New Tab page: `public/manifest.json` is copied to `dist/` (its `version` is stamped from `package.json` by the `manifest-version` plugin in `vite.config.js`, so bump the version only in `package.json`), and `vite.config.js` sets `base: './'` so assets load from `chrome-extension://`.

- `src/App.jsx` is the only component. The `useNow` hook updates `now` on each second boundary and pauses while the tab is hidden; the quote comes from the `useHourlyQuote` hook.
- `src/useHourlyQuote.js` owns quote fetching and caching:
  - The quote is cached under `hourly-quote` as `{text, author, fetchedAt}` in `chrome.storage.local` (needs the `storage` permission; falls back to `localStorage` under `npm run dev`, where `chrome.*` doesn't exist). The read is async, so the first render shows "Loading quote…" briefly.
  - `check()` reads the cache and fetches only if it is missing or at least an hour old; otherwise it schedules a timer for the remaining time. It re-runs on `visibilitychange`, `online`, and `chrome.storage.onChanged` (so tabs adopt a quote another tab fetched).
  - Fetches abort after 10s. Success reschedules an hour out; failure keeps the cached quote, sets `error`, and retries in 5 minutes.
- Quote URL depends on the mode (`import.meta.env.DEV` in `useHourlyQuote.js`): dev uses the Vite proxy `/zenquotes/*` → `https://zenquotes.io/api/*` (ZenQuotes sends no CORS headers); the built extension calls `https://zenquotes.io/api/random` directly, allowed by `host_permissions` in `manifest.json`.

## Styling

- `src/App.css` holds the real design (animated gradient body, glass cards, rotated cards, glowing quote card).
- `src/index.css` is mostly leftover Vite template CSS (e.g. `#social .button-icon`, `.counter`, `#root` capped at 1126px wide). Be aware it affects layout and global `h1`/`p` styles.
