const { app, BrowserWindow, dialog } = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const electron = require('electron');
const ipc = electron.ipcMain;

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/ScreenGif/index.html`),
            protocol: 'file:',
            slashes: true
        })
    );
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

/** Select Overlay ***********************************************************************************/
let overlayWindow;
ipc.on('openOverlay', (event) => {
    console.log('overlay opened');
    overlayWindow = new BrowserWindow({
        fullscreen: true,
        movable: false,
        transparent: true,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    overlayWindow.setAlwaysOnTop(true, 'pop-up-menu');

    overlayWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/ScreenGif/index.html`),
            hash: '/overlay',
            protocol: 'file:',
            slashes: true
        })
    );
    overlayWindow.show();
});

ipc.on('cancelOverlay', (event) => {
    overlayWindow.close();
});

ipc.on('selectOverlay', (event, clipPercents) => {
    overlayWindow.setIgnoreMouseEvents(true);
    mainWindow.webContents.send('clip', clipPercents);
});

/** Record Overlay ********************************************************************************/
let recordOverlayWindow;
ipc.on('recordOverlay', (event) => {
    recordOverlayWindow = new BrowserWindow({
        width: 100,
        height: 50,
        movable: false,
        transparent: true,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    overlayWindow.setAlwaysOnTop(true, 'pop-up-menu');
    /* TODO: If allowing more than one screen, must change */
    const bounds = electron.screen.getPrimaryDisplay().bounds;
    recordOverlayWindow.setPosition(bounds.x + bounds.width - 100, bounds.y);
    recordOverlayWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/ScreenGif/index.html`),
            hash: '/overlay-record',
            protocol: 'file:',
            slashes: true
        })
    );
    recordOverlayWindow.show();
});

ipc.on('startRecording', (event) => {
    mainWindow.webContents.send('startRecording');
});

ipc.on('endRecording', (event) => {
    mainWindow.webContents.send('stopRecording');
    recordOverlayWindow.close();
    overlayWindow.close();
})

/** GIF & Video LOGIC ********************************************************************************* */
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static').replace(
    'app.asar',
    'app.asar.unpacked'
);
const ffprobePath = require('ffprobe-static').path.replace(
    'app.asar',
    'app.asar.unpacked'
);
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
/** File Saving */
ipc.on('saveFile', async function (event, blob) {
    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save Video',
        defaultPath: `vid-${Date.now()}.webm`
    });
    if (filePath) {
        await fs.writeFile(filePath, blob, () => console.log('complete'));

        const outputPath = filePath.replace('webm', 'gif');
        console.log('\x1b[36m%s\x1b[0m', 'OUTPUT PATHHHH', outputPath);

        ffmpeg(filePath)
            .outputOption('-vf', 'fps=20')
            .save(outputPath);
    }
});

