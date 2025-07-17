import "./AudioButton.css";
import { MdHeadset } from "react-icons/md";
import { motion } from "framer-motion";

export default function AudioButton({ response }) {
  function toggle() {}
  return (
    <motion.button
      className="audio-btn"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={async () => {
        try {
          const audioBuffer = await window.electronAPI.text2Speech(
            response,
            "es"
          );
          const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.play();
        } catch (err) {
          console.error("Audio play error: ", err);
        }
      }}
    >
      <MdHeadset size={32} />
    </motion.button>
  );
}
