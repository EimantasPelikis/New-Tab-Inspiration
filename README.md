# New-Tab-Inspiration

Shows today's date, a live clock and an hourly quote ([ZenQuotes](https://zenquotes.io/)). Built with React + Vite, and packaged as a Chrome extension that replaces the New Tab page.

## Develop

```
npm install
npm run dev
```

In dev the quote request goes through a Vite proxy (`/zenquotes`), because ZenQuotes sends no CORS headers.

## Install as Chrome's New Tab page

1. `npm run build`
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the `dist/` folder.
4. Open a new tab.

After code changes, rebuild and click the reload icon on the extension card.

Notes:
- The extension only overrides the New Tab page, not the startup page or Home button.
- Chrome may show a "disable developer mode extensions" prompt on launch.
- The built app fetches `https://zenquotes.io/api/random` directly; `manifest.json` grants that host permission.

## Privacy

See [PRIVACY.md](PRIVACY.md).

## License

[Eclipse Public License 2.0](LICENSE) (EPL-2.0).
