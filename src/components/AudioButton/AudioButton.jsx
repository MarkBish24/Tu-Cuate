import "./AudioButton.css";
import { MdHeadset } from "react-icons/md";
import { motion } from "framer-motion";

export default function AudioButton() {
  function toggle() {}
  return (
    <motion.button
      className="audio-btn"
      initial={{ scale: 0.8, opacity: 0, x: "-50%" }}
      animate={{ scale: 1, opacity: 1, x: "-50%" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={() => {
        window.puter.ai
          .txt2speech("¡Hola!", "es-ES")
          .then((audio) => audio.play())
          .catch((err) => console.error(err));
      }}
    >
      <MdHeadset size={32} />
    </motion.button>
  );
}
