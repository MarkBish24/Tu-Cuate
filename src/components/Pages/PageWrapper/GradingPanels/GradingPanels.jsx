import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";

import "./GradingPanels.css";

// const info = [
//   {
//     original: "Yo fui a la tiendra porque necesitaba comprar el pan",
//     corrected: "Iba a la tienda porque necesitaba comprar pan.",
//     translation: "I was going to the store because I needed to buy bread.",
//     mistakes: [
//       {
//         type: "error",
//         description: "Incorrect verb conjugation",
//         original: "Yo fui a la tienda",
//         correction: "Yo iba a la tienda",
//         explanation:
//           "The verb 'ir' should be in the imperfect (iba) to reflect an ongoing or intended past action. 'Fui' is too definite/final for this context.",
//       },
//       {
//         type: "inaccuracy",
//         description: "Misuse of vocabulary",
//         original: "necesitaba tomar pan.",
//         correction: "necesitaba comprar pan.",
//         explanation:
//           "'Tomar' can mean 'to take' or 'to drink', but 'comprar' is the correct verb for buying something like bread.",
//       },
//       {
//         type: "alternative",
//         description: "More natural phrasing",
//         original: "Yo iba a la tienda porque necesitaba comprar el pan.",
//         correction: "Iba a la tienda porque necesitaba comprar pan.",
//         explanation:
//           "In casual speech, 'el' is often dropped before general items like 'pan'. Also, dropping 'yo' is more natural when the subject is clear from the verb.",
//       },
//     ],
//   },
// ];

export default function GradingPanels({ onContinue, onExit }) {
  //back end info
  const [haveInfo, setHaveInfo] = useState(false);
  const [info, setInfo] = useState(null);
  const hasRun = useRef(false);

  let panelData = null;
  let totalPages = 0;

  useEffect(() => {
    async function fetchGradedResponse() {
      if (hasRun.current) return;
      hasRun.current = true;
      if (window.electronAPI && window.electronAPI.gradeResponse) {
        try {
          const result = await window.electronAPI.gradeResponse();

          // 3. Save to MongoDB
          const saveResult = await window.electronAPI.saveSpanishAttempt(
            result
          );
          if (!saveResult.success) {
            console.error("Failed to save Spanish attempt:", saveResult.error);
          }

          setInfo(result);
          setHaveInfo(true);
        } catch (err) {
          console.error("Failed to grade response:", err);
        }
      } else {
        console.error("electronAPI.gradeResponse not available");
      }
    }
    fetchGradedResponse();
  }, []);

  // react info
  const [pageIndex, setPageIndex] = useState(0);
  if (info && info[0]) {
    panelData = info[0];
    totalPages = 1 + panelData.mistakes.length;
  }

  const changePage = (index) => {
    if (index >= 0 && index < totalPages) {
      setPageIndex(index);
    }
  };

  const renderPage = () => {
    if (pageIndex === 0) {
      return (
        <div className="grading-summary">
          <h3 className="grading-original">Original</h3>
          <p className="grading-original-text">{panelData.original}</p>
          <h3 className="grading-original">Corrected</h3>
          <p className="grading-original-text">{panelData.corrected}</p>
          <h3 className="grading-translation">Translation</h3>
          <p className="grading-translation-text">{panelData.translation}</p>
        </div>
      );
    }

    const mistake = panelData.mistakes[pageIndex - 1];
    return (
      <div className="mistake-panel">
        <h3 className="mistake-title">
          Mistake #{pageIndex}, Type : {mistake.type}{" "}
        </h3>
        <strong className="mistake-original">Original</strong>
        <p className="mistake-original-text">{mistake.original}</p>
        <strong className="mistake-correction">Correction</strong>
        <p className="mistake-correction-text">{mistake.correction}</p>
        <p className="mistake-explanation-text">
          <strong>Explanation: </strong>
          {mistake.explanation}
        </p>
      </div>
    );
  };

  return haveInfo ? (
    <div className="grading-wrapper">
      <div className="grading-page">
        <div
          className={`arrow-page ${pageIndex === 0 ? "inactive" : ""}`}
          style={{ transform: "rotate(90deg)" }}
          onClick={() => changePage(pageIndex - 1)}
        >
          <IoMdArrowDropdown size={48} />
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
          <IoMdArrowDropdown size={48} />
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
      <div className="grading-page-menu-btns">
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="start-btn"
          onClick={onContinue}
        >
          continue
        </motion.button>
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="start-btn"
          onClick={onExit}
        >
          exit
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
