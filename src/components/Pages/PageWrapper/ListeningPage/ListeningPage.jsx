import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./ListeningPage.css";
import AudioButton from "../../../../components/AudioButton/AudioButton.jsx";
import Microphone from "../../../MicButton/MicButton";

import { FaSpinner } from "react-icons/fa";

// const test = {
//   sentence_spanish: "Me puedes dar ese tazón por favor",
//   sentence_english: "Can you give me that bowl please",
//   word_translation: [
//     {
//       spanish: "Me",
//       english: "me",
//     },
//     {
//       spanish: "puedes",
//       english: "can you",
//     },
//     {
//       spanish: "dar",
//       english: "give",
//     },
//     {
//       spanish: "ese",
//       english: "that",
//     },
//     {
//       spanish: "tazón",
//       english: "bowl",
//     },
//     {
//       spanish: "por favor",
//       english: "please",
//     },
//   ],
// };

export default function ListeningPage({ onFinish }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [displaySentence, setDisplaySentence] = useState(false);
  const [haveInfo, setHaveInfo] = useState(false);
  const [info, setInfo] = useState(null);
  const hasRun = useRef(false);

  useEffect(() => {
    async function fetchQuestion() {
      if (hasRun.current) return;
      hasRun.current = true;
      if (window.electronAPI && window.electronAPI.generateResponse) {
        try {
          const result = await window.electronAPI.generateResponse();
          setInfo(result);
          setHaveInfo(true);
        } catch (err) {
          console.error("Failed to generate question:", err);
        }
      } else {
        console.error("electronAPI.generateResponse not available");
      }
    }

    fetchQuestion();
  }, []);

  return haveInfo ? (
    <div>
      <div className="listening-cntr">
        <button
          className="listening-title"
          onClick={() => setDisplaySentence((prev) => !prev)}
        >
          Show Sentence
        </button>
        <motion.div
          className="translated-word-cntr"
          initial={false}
          animate={{
            opacity: displaySentence ? 1 : 0.25,
            filter: displaySentence ? "blur(0px)" : "blur(10px)",
            pointerEvents: displaySentence ? "auto" : "none",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {info.word_translation.map((word, index) => (
            <div
              className="word-wrapper"
              onClick={() =>
                setActiveIndex(index === activeIndex ? null : index)
              }
            >
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    className="tooltip"
                    initial={{ opacity: 0, y: 10, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {word.english}
                  </motion.div>
                )}
              </AnimatePresence>

              <div key={index} className="translated-word-element">
                {word.spanish}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="btn-cntr">
        <AudioButton />
        <Microphone />
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="start-btn"
          onClick={onFinish}
        >
          continue
        </motion.button>
      </div>
    </div>
  ) : (
    <motion.div
      className="loading-page"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="loading-wheel"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
      >
        <FaSpinner size={50} />
      </motion.div>
      <div>Loading</div>
    </motion.div>
  );
}
