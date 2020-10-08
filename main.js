const {app, BrowserWindow, dialog} = require('electron')
const url = require("url");
const path = require("path");
const fs = require('fs');
const electron = require('electron');
const ipc = electron.ipcMain;

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/ScreenGif/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipc.on('openOverlay', (event) => {
  const overlayWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  overlayWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/ScreenGif/index.html`),
      hash: '/overlay',
      protocol: "file:",
      slashes: true
    })
  );
  overlayWindow.show();
})

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

ipc.on('saveFile', async function (event, blob) {
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save Video',
    defaultPath: `vid-${Date.now()}.webm`
  });
  if (filePath) {
    fs.writeFile(filePath, blob, () => console.log('complete'));
  }
});