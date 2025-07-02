const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveAudioFile: (buffer) => ipcRenderer.send("save-audio-file", buffer),
});
