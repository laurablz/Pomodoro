const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 350,
        height: 450,
        frame: false,
        transparent: true,
        resizable: false,
        maximizable: false,
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