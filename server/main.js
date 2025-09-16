const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const utils = require("./utils.js");
const { connectToDB } = require("./db");

const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

// SETTING UP MAIN WINDOW AND DEFAULT SETTINGS

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

// when the user is finished recording, it cuts down the audio and it replaces the  pre-exisitng audio file in the public folder
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

// With the ID it looks for the appropriate item and checks it as either active or inactive

ipcMain.handle("check-item", async (event, { id, checked }) => {
  // **** NEW WAY USING DATA MONGO DATABASE ****
  try {
    // id is split into parts EX * verbs-04-28 *
    const parts = id.split("-");
    const collectionName = parts[0];
    const sectionId = parts[1];
    const itemId = id;

    const db = await connectToDB();
    const collection = db.collection(collectionName);

    // Searching for the exact ID to be checked
    const result = await collection.updateOne(
      { id: sectionId, "items.id": itemId },
      { $set: { "items.$.active": checked } }
    );

    if (result.modifiedCount === 0) {
      throw new Error(
        `Failed to update item ${itemId} in section ${sectionId}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating check item:", error);
    return { success: false, error: error.message };
  }

  // **** OLD WAY USING JSON FILES ****
  // try {
  //   const parts = id.split("-");
  //   const fileName = parts[0] + ".json";
  //   const sectionId = parts[1];
  //   const itemId = id;
  //   const filePath = path.join(__dirname, "data", fileName);
  //   const fileContent = await fs.promises.readFile(filePath, "utf-8");
  //   const data = JSON.parse(fileContent);
  //   const section = data.find((section) => section.id === sectionId);
  //   if (!section) throw new Error(`Section with id ${sectionId} not found`);
  //   const item = section.items.find((item) => item.id === itemId);
  //   if (!item) throw new Error(`Item with id ${itemId} not found`);
  //   item.active = checked;
  //   await fs.promises.writeFile(
  //     filePath,
  //     JSON.stringify(data, null, 2),
  //     "utf-8"
  //   );
  //   return { success: true };
  // } catch (error) {
  //   console.error("Error updating check item:", error);
  //   return { success: false, error: error.message };
  // }
});

// gets all the collection files to display in the settings panel

ipcMain.handle("get-collection-data", async (event, collectionName) => {
  try {
    const db = await connectToDB();
    const collection = db.collection(collectionName);
    const data = await collection.find({}).toArray();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching collection data:", error);
    return { success: false, error: error.message };
  }
});

// Basic function that are connected through the utils folder

ipcMain.handle("generate-response", async () => {
  return await utils.generateResponse();
});

ipcMain.handle("grade-response", async () => {
  return await utils.gradeResponse();
});

ipcMain.handle("save-spanish-attempt", async (event, data) => {
  try {
    const db = await connectToDB();
    const collection = db.collection("spanish_attempts");

    const attemptObject = Array.isArray(data) ? data[0] : data;

    const dataToSave = {
      ...attemptObject,
      timestamp: new Date(),
    };

    const result = await collection.insertOne(dataToSave);
    console.log("Document inserted with ID:", result.insertedId);

    return { success: true, id: result.insertedId };
  } catch (err) {
    console.error("Failed to save Spanish attempt:", err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle("get-spanish-data", async (event, startDate, endDate) => {
  try {
    const db = await connectToDB();
    const collection = db.collection("spanish_attempts");

    const start = new Date(startDate);
    const end = new Date(endDate);

    const data = await collection
      .aggregate([
        { $unwind: "$mistakes" },
        {
          $match: { timestamp: { $gte: start, $lte: end } }, // optional time filter
        },
        {
          $project: {
            _id: 0,
            originalSentence: "$original",
            originalMistake: "$mistakes.original",
            correction: "$mistakes.correction",
            explanation: "$mistakes.explanation",
            category: "$mistakes.category",
            type: "$mistakes.type",
            timestamp: 1,
          },
        },
      ])
      .toArray();

    return { success: true, data };
  } catch (err) {
    console.error("Failed to Fetch Spanish Data", err);
    return { success: false, error: err.message };
  }
});
