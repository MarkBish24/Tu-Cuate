import "./ConvoTab.css";
import { motion } from "framer-motion";

export default function ConvoTab({ title, icon }) {
  return (
    <>
      <motion.div
        className="conversation-tab"
        initial={{ flexGrow: 1 }}
        whileHover={{ flexGrow: 2 }}
        transition={{ duration: 0.3 }}
      >
        <h1>{title}</h1>
        <p>Description</p>
        <div className="icon-wrapper">{icon}</div>
      </motion.div>
    </>
  );
}
