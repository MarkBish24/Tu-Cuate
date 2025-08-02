const { contextBridge, ipcRenderer } = require("electron");

let mediaRecorder = null;
let audioChunks = [];

contextBridge.exposeInMainWorld("electronAPI", {
  startRecording: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      mediaRecorder.start();

      return "recording_started";
    } catch (err) {
      console.error("Error Starting recording:", err);
      throw err;
    }
  },
  stopRecording: async () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
      throw new Error("No recording in progress");
    }

    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const arrayBuffer = await audioBlob.arrayBuffer();

          // Send buffer to main process to save the file
          const savedFilePath = await ipcRenderer.invoke(
            "save-audio-file",
            Buffer.from(arrayBuffer)
          );

          // Stop all media tracks
          mediaRecorder.stream.getTracks().forEach((track) => track.stop());

          // Reset
          mediaRecorder = null;
          audioChunks = [];

          resolve(savedFilePath);
        } catch (error) {
          reject(error);
        }
      };

      mediaRecorder.stop();
    });
  },
  checkItem: async (id, checked) => {
    return ipcRenderer.invoke("check-item", { id, checked });
  },
  getCollectionData: async (collectionName) => {
    return await ipcRenderer.invoke("get-collection-data", collectionName);
  },
  generateResponse: () => ipcRenderer.invoke("generate-response"),
  gradeResponse: () => ipcRenderer.invoke("grade-response"),
});

//  transcribeAudio,generateResponse,gradeResponse,resetMessages,
