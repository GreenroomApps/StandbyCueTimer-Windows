const BASE = 'https://standbycue.app'
const codeInput = document.getElementById('code')
const view = document.getElementById('view')
const hint = document.getElementById('hint')
const pin = document.getElementById('pin')

function show(code) {
  const c = (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
  const ready = c.length === 5
  // While not ready (no code yet) the bar stays visible so you can type the code.
  document.body.classList.toggle('ready', ready)
  if (!ready) { view.classList.add('hidden'); hint.classList.remove('hidden'); return }
  view.src = `${BASE}/timer?code=${c}`
  view.classList.remove('hidden'); hint.classList.add('hidden')
}

let saved = ''
try { saved = localStorage.getItem('sc.code') || '' } catch (e) { /* ignore */ }
codeInput.value = saved
if (saved) show(saved)

function apply() {
  const c = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
  codeInput.value = c
  try { localStorage.setItem('sc.code', c) } catch (e) { /* ignore */ }
  show(c)
}
codeInput.addEventListener('change', apply)
codeInput.addEventListener('keydown', e => { if (e.key === 'Enter') { apply(); codeInput.blur() } })

// The timer page (in the webview) relays the API "fullscreen" toggle up to us; pass it
// on to the main process to flip the OS window.
view.addEventListener('ipc-message', (e) => {
  if (e.channel === 'sc-fullscreen') window.sc.setFullscreen(!!e.args[0])
  else if (e.channel === 'sc-hide') window.sc.setHidden(!!e.args[0])
})

let onTop = true
pin.addEventListener('click', () => { onTop = !onTop; pin.classList.toggle('on', onTop); window.sc.setAlwaysOnTop(onTop) })
document.getElementById('min').addEventListener('click', () => window.sc.minimize())
document.getElementById('close').addEventListener('click', () => window.sc.quit())

// Reveal the whole top bar whenever the mouse is near the top of the window, and
// keep it up briefly after (so it doesn't rely on hovering a button exactly).
const topZone = document.querySelector('.top')
let hideTimer
function revealBar() {
  document.body.classList.add('show-bar')
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => document.body.classList.remove('show-bar'), 1800)
}
topZone.addEventListener('mouseenter', revealBar)
topZone.addEventListener('mousemove', revealBar)
