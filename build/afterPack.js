// electron-builder afterPack hook.
// The mac build is intentionally not code-signed with a real Developer ID (identity:null),
// but a COMPLETELY unsigned arm64 app is rejected by Apple Silicon as "damaged" and won't
// launch at all. Giving it an ad-hoc signature (`codesign --sign -`) fixes that: the app
// runs, and Gatekeeper downgrades to the ordinary "unidentified developer" prompt that a
// right-click → Open clears. This runs after the .app is packed, before the .dmg is built,
// so the signature ends up inside the shipped dmg.
const { execFileSync } = require('child_process')
const path = require('path')

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'darwin') return
  const appName = context.packager.appInfo.productFilename
  const appPath = path.join(context.appOutDir, `${appName}.app`)
  console.log(`afterPack: ad-hoc signing ${appPath}`)
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], { stdio: 'inherit' })
}
