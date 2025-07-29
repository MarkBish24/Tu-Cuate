const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

const utils = require("./utils.js");

ffmpeg.setFfmpegPath(ffmpegPath);

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
    const audioFolder = path.join(__dirname, "..", "public", "audio");

    fs.mkdirSync(audioFolder, { recursive: true });

    const inputPath = path.join(audioFolder, "audio-raw.wav");
    const outputPath = path.join(audioFolder, "audio.wav");

    await fs.promises.writeFile(inputPath, Buffer.from(buffer));

    // console.log("Audio file saved at:", filePath);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioFilters([
          "loudnorm", // normalize volume
          "silenceremove=1:0:-50dB", // remove silence
        ])
        .outputOptions([
          "-ar 16000", // sample rate: 16kHz
          "-ac 1", // mono
          "-sample_fmt s16", // signed 16-bit PCM
        ])
        .on("end", () => {
          fs.unlinkSync(inputPath); // delete raw file
          resolve(outputPath); // return cleaned file
        })
        .on("error", (err) => {
          console.error("FFmpeg error:", err);
          reject(err);
        })
        .save(outputPath);
    });
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

ipcMain.handle("generate-response", async () => {
  return await utils.generateResponse();
});

ipcMain.handle("grade-response", async () => {
  return await utils.gradeResponse();
});
