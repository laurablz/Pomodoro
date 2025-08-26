const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  cerrarVentana: () => ipcRenderer.send("cerrarVentana"),
  minimizarVentana: () => ipcRenderer.send("minimizarVentana")
});
