# PolicyCore Desktop (Windows / macOS)

Native desktop shell for the [Insurance Policy Administration System](../../public/projects/insurance-policy-admin/index.html) demo, built with Electron. Loads the live dashboard in a dedicated window (falling back to an offline page if unreachable) so it can be installed and launched like any other desktop app.

## Run locally

```bash
cd desktop/insurance-admin-desktop
npm install
npm start
```

## Build installers

```bash
npm run dist:win   # -> dist/PolicyCore-Windows-Setup.exe (run on/targeting Windows)
npm run dist:mac    # -> dist/PolicyCore-macOS.dmg (must run on macOS)
```

> `electron-builder` can only produce `.dmg` output when run on macOS. Windows and Linux builds can be produced from any host. The [`release-desktop.yml`](../../.github/workflows/release-desktop.yml) GitHub Actions workflow builds both installers on `windows-latest` and `macos-latest` runners and publishes them to the rolling `desktop-artifacts-latest` GitHub Release, which is what the portfolio site's Windows/macOS download buttons link to.
