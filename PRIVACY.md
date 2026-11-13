# Privacy Policy for New-Tab-Inspiration

_Last updated: 13 November 2026_

New-Tab-Inspiration ("the extension") replaces Chrome's New Tab page with today's date, a live clock and a quote that refreshes hourly. This policy explains what the extension does with data.

## Summary

- The extension does not collect, store or transmit any personal information to the developer.
- It has no accounts, no analytics, no advertising and no tracking.
- To show a quote it contacts one third-party service, ZenQuotes (zenquotes.io).

## Data the extension handles

**Quote cache (stored on your device).** The extension saves the most recent quote (its text, author and the time it was fetched) in Chrome's extension storage (`chrome.storage.local`) so a quote shows immediately and the service isn't contacted on every new tab. This data stays on your device. It is not sent to the developer, and it is removed when you uninstall the extension.

**Date and time.** The date and clock are read from your device. They are displayed only and are never stored or transmitted.

## Third-party service: ZenQuotes

About once an hour, and when the cached quote is out of date, the extension requests a random quote from `https://zenquotes.io/api/random`. As with any web request, ZenQuotes receives your IP address and standard request information such as your browser's user agent. The request contains no personal information, account identifiers or browsing history from the extension.

How ZenQuotes handles that information is governed by its own policies: https://zenquotes.io/. The extension also shows an attribution link to ZenQuotes. Following that link opens their website, which is outside this extension.

## Permissions and why they are needed

- **`storage`**: to cache the current quote on your device.
- **Host permission `https://zenquotes.io/*`**: to fetch the quote. The extension makes no requests to any other site.

The extension does not read or change the pages you visit, does not access your browsing history, tabs, bookmarks or cookies, and does not run remote code. All code is packaged inside the extension.

## What we don't do

- We don't sell or share user data, because we don't collect any.
- We don't use data for advertising, profiling or creditworthiness.
- We don't use analytics or crash-reporting services.

## Children's privacy

The extension collects no personal information from anyone, including children.

## Changes to this policy

If the extension's data practices change, this policy will be updated and the "Last updated" date revised. Material changes will be reflected in the Chrome Web Store listing.

## Contact

Questions about this policy: **eimantas.pelikis@gmail.com**
