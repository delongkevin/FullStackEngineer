# ShopQuick Desktop (Windows / macOS)

Native desktop shell for the [Online Grocery Order System](../../public/projects/order-system/index.html) demo, built with Electron. Loads the live dashboard in a dedicated window (falling back to an offline page if unreachable) so it can be installed and launched like any other desktop app.

## Run locally

```bash
cd desktop/order-system-desktop
npm install
npm start
```

## Build installers

```bash
npm run dist:win   # -> dist/ShopQuick-Windows-Setup.exe (run on/targeting Windows)
npm run dist:mac    # -> dist/ShopQuick-macOS.dmg (must run on macOS)
```

> `electron-builder` can only produce `.dmg` output when run on macOS. Windows and Linux builds can be produced from any host. The [`release-desktop.yml`](../../.github/workflows/release-desktop.yml) GitHub Actions workflow builds all desktop apps on `windows-latest` and `macos-latest` runners and publishes them to the rolling `desktop-artifacts-latest` GitHub Release, which is what the portfolio site's Windows/macOS download buttons link to.
