// Runs inside the <webview> that loads standbycue.app/timer. It exposes a tiny bridge
// to that page so the web app can ask the Electron shell to toggle full screen. The
// page calls window.scHost.setFullscreen(bool); we relay it to the host window, which
// forwards it to the main process (main.js → win.setFullScreen).
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('scHost', {
  setFullscreen: (on) => ipcRenderer.sendToHost('sc-fullscreen', !!on),
})
