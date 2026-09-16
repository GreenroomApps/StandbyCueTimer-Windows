// StandbyCue Presentation timer — Windows overlay.
// A frameless, always-on-top, resizable window that hosts the StandbyCue web
// stage-timer. Sits on the presenter's screen next to PowerPoint Presenter View
// (works with any app — it's a normal OS window, not a PowerPoint plugin).

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

const cfgPath = () => path.join(app.getPath('userData'), 'window.json')
function loadCfg() { try { return JSON.parse(fs.readFileSync(cfgPath(), 'utf8')) } catch { return {} } }
function saveCfg(c) { try { fs.writeFileSync(cfgPath(), JSON.stringify(c)) } catch { /* ignore */ } }

let win = null

function createWindow() {
  const c = loadCfg()
  win = new BrowserWindow({
    width: c.width || 360,
    height: c.height || 220,
    x: c.x,
    y: c.y,
    minWidth: 240,
    minHeight: 130,
    frame: false,            // custom slim drag bar instead of the OS title bar
    resizable: true,         // drag any edge/corner to resize
    alwaysOnTop: true,
    skipTaskbar: false,
    backgroundColor: '#111111',
    title: 'StandbyCue Presentation timer',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,      // the <webview> loads the timer as a top-level doc (no X-Frame-Options issue)
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Float above other windows, including a maximised Presenter View.
  win.setAlwaysOnTop(true, 'screen-saver')
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'))

  const persist = () => { if (win) saveCfg({ ...loadCfg(), ...win.getBounds() }) }
  win.on('resize', persist)
  win.on('move', persist)
  win.on('closed', () => { win = null })
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => { if (!win) createWindow() })

ipcMain.on('quit', () => app.quit())
ipcMain.on('minimize', () => { if (win) win.minimize() })
ipcMain.on('toggle-top', (_e, on) => {
  if (!win) return
  if (on) win.setAlwaysOnTop(true, 'screen-saver')
  else win.setAlwaysOnTop(false)   // passing a level with false doesn't reliably drop it
})
