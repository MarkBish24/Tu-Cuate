import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./ListeningPage.css";
import AudioButton from "../../../../components/AudioButton/AudioButton.jsx";
import Microphone from "../../../MicButton/MicButton";

const test = {
  sentence_spanish: "Me puedes dar ese tazón por favor",
  sentence_english: "Can you give me that bowl please",
  word_translation: [
    {
      spanish: "Me",
      english: "me",
    },
    {
      spanish: "puedes",
      english: "can you",
    },
    {
      spanish: "dar",
      english: "give",
    },
    {
      spanish: "ese",
      english: "that",
    },
    {
      spanish: "tazón",
      english: "bowl",
    },
    {
      spanish: "por favor",
      english: "please",
    },
  ],
};

export default function ListeningPage({ onFinish }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [displaySentence, setDisplaySentence] = useState(false);

  return (
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
          {test.word_translation.map((word, index) => (
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
      </div>

      <button onClick={onFinish}>continue</button>
    </div>
  );
}
