import "./AudioButton.css";
import { MdHeadset } from "react-icons/md";
import { motion } from "framer-motion";

export default function AudioButton() {
  const playAudio = () => {
    const audio = new Audio("../../../public/speech/speech.wav"); // Public folder path
    audio.volume = 1.0; // Optional
    audio.play();
  };

  return (
    <div>
      <motion.button
        className="audio-btn"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={playAudio}
      >
        <MdHeadset size={32} />
      </motion.button>
    </div>
  );
}
