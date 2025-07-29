import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import StartPage from "../StartPage/StartPage.jsx";
import ListeningPage from "./ListeningPage/ListeningPage.jsx";
import GradingPanels from "./GradingPanels/GradingPanels.jsx";
import "./PageWrapper.css";

export default function PageWrapper() {
  const [mode, setMode] = useState("start");

  let content;

  switch (mode) {
    case "start":
      content = <StartPage onStart={() => setMode("listening")} />;
      break;

    case "listening":
      content = <ListeningPage onFinish={() => setMode("grading")} />;
      break;

    case "grading":
      content = (
        <GradingPanels
          onContinue={() => setMode("listening")}
          onExit={() => setMode("start")}
        />
      );
      break;

    default:
      content = <StartPage onStart={() => setMode("listening")} />;
  }

  return (
    <div className="page-wrapper">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
