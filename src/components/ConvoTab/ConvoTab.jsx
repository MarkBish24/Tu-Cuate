import "./ConvoTab.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ConvoTab({
  title,
  description,
  icon,
  isExpanded,
  route,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <>
      <motion.div
        className={`conversation-tab ${isExpanded ? "expanded" : ""}`}
        onClick={handleClick}
        initial={{ flexGrow: 1 }}
        whileHover={{ flexGrow: 2 }}
        transition={{ duration: 0.3 }}
      >
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="icon-wrapper">{icon}</div>
      </motion.div>
    </>
  );
}
