// Minimal, safe bridge — the renderer can only trigger these three window actions.
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('sc', {
  quit: () => ipcRenderer.send('quit'),
  minimize: () => ipcRenderer.send('minimize'),
  setAlwaysOnTop: (on) => ipcRenderer.send('toggle-top', on),
  setFullscreen: (on) => ipcRenderer.send('set-fullscreen', on),
  setHidden: (on) => ipcRenderer.send('set-hidden', on),
})
