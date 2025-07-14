import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./ListeningPage.css";
import AudioButton from "../../../../components/AudioButton/AudioButton.jsx";

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

export default function ListeningPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div>
      <div className="listening-cntr">
        <span className="listening-title">Question Element</span>
        <div className="translated-word-cntr">
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
        </div>
      </div>
      <AudioButton />
    </div>
  );
}
