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

// Auto-hide the top bar + the mouse pointer after 5s of no movement, and hide them
// immediately when the pointer leaves the window or the app loses focus.
//
// Visibility is JS-only now (see the CSS note): body.show-bar shows the bar,
// body.hide-cursor hides the pointer. The webview swallows mouse events, so once the
// pointer is over the timer content the host stops getting mousemove — the 5s timer then
// hides everything, which is exactly what we want.
const topZone = document.querySelector('.top')
const HIDE_MS = 5000
let hideTimer

function scheduleHide() {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    document.body.classList.remove('show-bar')
    document.body.classList.add('hide-cursor')     // hide the pointer too
  }, HIDE_MS)
}
function revealBar() {
  document.body.classList.add('show-bar')
  document.body.classList.remove('hide-cursor')
  scheduleHide()
}
function hideNow() {
  clearTimeout(hideTimer)
  document.body.classList.remove('show-bar')
  document.body.classList.add('hide-cursor')
}

// Moving near the top reveals the bar; any movement in the window brings the pointer
// back and restarts the 5s countdown while the bar is up.
topZone.addEventListener('mouseenter', revealBar)
topZone.addEventListener('mousemove', revealBar)
window.addEventListener('mousemove', () => {
  document.body.classList.remove('hide-cursor')
  if (document.body.classList.contains('show-bar')) scheduleHide()
})
// The pointer left the window, or the app lost focus → hide bar + pointer right away.
// (Fixes buttons that used to stay up because a stuck CSS :hover never cleared.)
document.addEventListener('mouseleave', hideNow)
window.addEventListener('blur', hideNow)
