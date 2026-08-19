// SAPTestManager desktop shell — loads the live SAP Test Manager Greenfield Command Center
// dashboard in a native window, falling back to a bundled offline page if the
// site is unreachable. Same "web-wrapped native app" approach used by the
// Android build in android/sap-test-manager.

const { app, BrowserWindow } = require('electron');
const path = require('path');

const PRIMARY_URL = 'https://fullstackengineer.netlify.app/projects/sap-test-manager/index.html';
const OFFLINE_URL = `file://${path.join(__dirname, 'offline.html')}`;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    title: 'SAPTestManager — SAP Test Manager Greenfield Command Center',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(PRIMARY_URL).catch(() => win.loadURL(OFFLINE_URL));

  win.webContents.on('did-fail-load', (_event, errorCode, _desc, validatedURL) => {
    if (validatedURL !== OFFLINE_URL && errorCode !== -3 /* ERR_ABORTED from navigation cancel */) {
      win.loadURL(OFFLINE_URL);
    }
  });

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
