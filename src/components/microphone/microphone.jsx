import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

import "./microphone.css";

export default function Microphone({ isRecording, onToggle }) {
  // for sound
  const notificationSound = new Audio("../../../assets/sound/Notification.wav");
  notificationSound.volume = 0.14;
  useEffect(() => {
    if (isRecording) {
      notificationSound.play();
      startRecording();
    } else {
      notificationSound.play();
      stopRecording();
    }
  }, [isRecording]);

  // for audio recording
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, {
          type: "audio/webm",
        });
        const arrayBuffer = await audioBlob.arrayBuffer();
        console.log("Audio Blob:", audioBlob);
        console.log("ArrayBuffer length:", arrayBuffer.byteLength);

        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());

        window.electronAPI.saveAudioFile(arrayBuffer);

        audioChunks.current = [];
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Mic Access Error: ", err);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
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
      onClick={onToggle}
    >
      {isRecording ? (
        <FaMicrophone size={32} />
      ) : (
        <FaMicrophoneSlash size={32} />
      )}
    </motion.button>
  );
}
