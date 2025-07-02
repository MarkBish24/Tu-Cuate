import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

import "./microphone.css";

export default function Microphone({ isRecording, onToggle }) {
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, {
          type: "audio/webm",
        });
        console.log("Audio Blob:", audioBlob);

        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());

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
