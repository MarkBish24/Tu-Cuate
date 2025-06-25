import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./HomeButton.css";

export default function HomeButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <motion.button
      className="home-btn"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      ⬅ Home
    </motion.button>
  );
}
