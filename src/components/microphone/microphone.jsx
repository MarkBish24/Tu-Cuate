import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

import "./microphone.css";

export default function Microphone() {
  const [isRecording, setIsRecording] = useState(false);
  const notificationSoundRef = useRef(null);

  // Load notification sound on mount
  useEffect(() => {
    notificationSoundRef.current = new Audio(
      "../../../assets/sound/Notification.wav"
    );
    notificationSoundRef.current.volume = 0.14;
  }, []);

  // Handle recording start/stop when isRecording changes
  useEffect(() => {
    if (!notificationSoundRef.current) return;

    notificationSoundRef.current.play();

    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  const startRecording = async () => {
    try {
      await window.electronAPI.startRecording();
      console.log("Recording started");
    } catch (error) {
      console.error("Start recording error:", error);
    }
  };

  const stopRecording = async () => {
    try {
      const filePath = await window.electronAPI.stopRecording();
      console.log("Audio saved at:", filePath);
    } catch (error) {
      console.error("Stop recording error:", error);
    }
  };

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`microphone-btn ${isRecording ? "active" : ""}`}
      onClick={toggleRecording}
      aria-pressed={isRecording}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {isRecording ? (
        <FaMicrophone size={32} />
      ) : (
        <FaMicrophoneSlash size={32} />
      )}
    </motion.button>
  );
}
