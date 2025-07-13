const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;

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

ipcMain.handle("save-audio-file", async (event, buffer) => {
  try {
    const audioFolder = path.join(__dirname, "data", "audio");

    fs.mkdirSync(audioFolder, { recursive: true });

    const timestamp = Date.now();
    const filePath = path.join(audioFolder, `recording-${timestamp}.webm`);

    await fs.promises.writeFile(filePath, Buffer.from(buffer));

    console.log("Audio file saved at:", filePath);

    return filePath;
  } catch (err) {
    console.error("Error Writing Audio File:", err);
    throw err;
  }
});

ipcMain.handle("check-item", async (event, { id, checked }) => {
  try {
    const parts = id.split("-");

    const fileName = parts[0] + ".json";
    const sectionId = parts[1];
    const itemId = id;

    const filePath = path.join(__dirname, "data", fileName);
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const section = data.find((section) => section.id === sectionId);
    if (!section) throw new Error(`Section with id ${sectionId} not found`);

    const item = section.items.find((item) => item.id === itemId);
    if (!item) throw new Error(`Item with id ${itemId} not found`);

    item.active = checked;

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(data, null, 2),
      "utf-8"
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating check item:", error);
    return { success: false, error: error.message };
  }
});
