// Clicking the toolbar icon opens this extension's page in chrome://extensions.
// (There is no popup, so action.onClicked fires.) Plain JS in public/ so Vite
// copies it to dist/ untouched.
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: `chrome://extensions/?id=${chrome.runtime.id}` })
})
