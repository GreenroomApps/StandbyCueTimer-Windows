# StandbyCue Presentation timer — Windows overlay

A small **always-on-top, movable, resizable** window that shows the StandbyCue
live stage timer. Put it on your presenting laptop next to **PowerPoint Presenter
View** (or Keynote, Google Slides — it's a normal window, not a PowerPoint plugin,
so it works with anything).

Why not a PowerPoint add-in: Office add-ins only run inside PowerPoint's editing
UI — they are never shown during the full-screen slide show or Presenter View, and
there's no API to draw over the show. A separate floating window is the way to do it.

## Run it (development)
Requires [Node.js](https://nodejs.org) (LTS). Also needs the **WebView2 runtime**,
which is already installed on Windows 10/11.

```
cd StandbyCueTimer-Windows
npm install
npm start
```

## Build a portable .exe (no installer)
```
npm run dist
```
The finished `StandbyCue Presentation timer <version>.exe` lands in `dist/`. Copy it anywhere and
double-click — no install needed. (Optional: drop a `build/icon.ico` before building
to give it the StandbyCue icon; without it electron-builder uses a default icon.)

## Use it
1. In StandbyCue open the rundown → **Share · Stage timer** and copy the 5-character
   timer code.
2. Launch the app, type the code in the top bar, press Enter.
3. Drag the top bar to move it; drag any edge/corner to resize; 📌 toggles
   always-on-top; ✕ closes.

The code and the window's size/position are remembered between launches.
