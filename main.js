const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 500,
        frame: false,
        transparent: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile("index.html");
}

ipcMain.on("cerrarVentana", () => {
  if (win) win.close();
});

ipcMain.on("minimizarVentana", () => {
  if (win) win.minimize();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});