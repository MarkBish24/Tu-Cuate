const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const window = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    window.loadURL("http://localhost:5173");
  } else {
    window.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// deactivates when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("save-audio-file", (event, buffer) => {
  const audioFolder = path.join(__dirname, "data", "audio");

  fs.mkdirSync(audioFolder, { recursive: true });

  const timestamp = Date.now();
  const filePath = path.join(audioFolder, `recording-${timestamp}.webm`);

  fs.writeFile(filePath, Buffer.from(buffer), (err) => {
    if (err) {
      console.error("Error Writing Audio File:", err);
    } else {
      console.log("Audio file saved at:", filePath);
    }
  });
});
