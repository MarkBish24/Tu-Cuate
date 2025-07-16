import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";

import "./GradingPanels.css";

const info = [
  {
    original: "You fui a la tiendra porque necesitaba comprar el pan",
    corrected: "Iba a la tienda porque necesitaba comprar pan.",
    translation: "I was going to the store because I needed to buy bread.",
    mistakes: [
      {
        type: "error",
        description: "Incorrect verb conjugation",
        original: "Yo fui a la tienda",
        correction: "Yo iba a la tienda",
        explanation:
          "The verb 'ir' should be in the imperfect (iba) to reflect an ongoing or intended past action. 'Fui' is too definite/final for this context.",
      },
      {
        type: "inaccuracy",
        description: "Misuse of vocabulary",
        original: "necesitaba tomar pan.",
        correction: "necesitaba comprar pan.",
        explanation:
          "'Tomar' can mean 'to take' or 'to drink', but 'comprar' is the correct verb for buying something like bread.",
      },
      {
        type: "alternative",
        description: "More natural phrasing",
        original: "Yo iba a la tienda porque necesitaba comprar el pan.",
        correction: "Iba a la tienda porque necesitaba comprar pan.",
        explanation:
          "In casual speech, 'el' is often dropped before general items like 'pan'. Also, dropping 'yo' is more natural when the subject is clear from the verb.",
      },
    ],
  },
];

export default function GradingPanels({ onContinue, onExit }) {
  const [pageIndex, setPageIndex] = useState(0);
  const panelData = info[0];
  const totalPages = 1 + panelData.mistakes.length;

  const changePage = (index) => {
    if (index >= 0 && index < totalPages) {
      setPageIndex(index);
    }
  };

  const renderPage = () => {
    if (pageIndex === 0) {
      return (
        <div className="grading-summary">
          <h3>Original:</h3>
          <p>{panelData.original}</p>
          <h3>Corrected:</h3>
          <p>{panelData.corrected}</p>
          <h3>Translation:</h3>
          <p>{panelData.translation}</p>
        </div>
      );
    }

    const mistake = panelData.mistakes[pageIndex - 1];
    return (
      <div className="mistake-panel">
        <h3>Mistake {pageIndex}:</h3>
        <p>
          <strong>Type:</strong> {mistake.type}
        </p>
        <p>
          <strong>Description:</strong> {mistake.description}
        </p>
        <p>
          <strong>Original:</strong> {mistake.original}
        </p>
        <p>
          <strong>Correction:</strong> {mistake.correction}
        </p>
        <p>
          <strong>Explanation:</strong> {mistake.explanation}
        </p>
      </div>
    );
  };

  return (
    <div className="grading-wrapper">
      <div className="grading-page">
        <div
          className={`arrow-page ${pageIndex === 0 ? "inactive" : ""}`}
          style={{ transform: "rotate(90deg)" }}
          onClick={() => changePage(pageIndex - 1)}
        >
          <IoMdArrowDropdown size={32} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIndex}
            className="grading-panel"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
        <div
          className={`arrow-page ${
            pageIndex === totalPages - 1 ? "inactive" : ""
          }`}
          style={{ transform: "rotate(-90deg)" }}
          onClick={() => changePage(pageIndex + 1)}
        >
          <IoMdArrowDropdown size={32} />
        </div>
      </div>

      <div className="pagination-dots">
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={`dot ${pageIndex === i ? "active" : ""}`}
            onClick={() => changePage(i)}
          ></span>
        ))}
      </div>
    </div>
  );
}
