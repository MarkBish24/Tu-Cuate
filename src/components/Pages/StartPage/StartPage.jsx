import { useState } from "react";

import { useMode } from "../../../contexts/ModeContext.jsx";

import HomeButton from "../../HomeButton/HomeButton.jsx";
import SettingsTab from "../../SettingsTab/SettingsTab.jsx";

import { IoMdSettings } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { RxCross1 } from "react-icons/rx";

import "./StartPage.css";

export default function StartPage({ onStart }) {
  const { mode } = useMode();
  // used for the settings page
  const [spin, setSpin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  //sets a design for when the settings page slides in
  const handleClick = () => {
    setSpin(true);
    setIsOpen((prev) => !prev);
    setTimeout(() => setSpin(false), 600);
  };
  // animations for the spin of the wheel
  const spinVariants = {
    spin: { rotate: [0, -25, 370] },
    idle: { rotate: 0 },
  };

  const panelVariants = {
    hidden: {
      x: "-50vw",
    },
    visible: {
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4,
      },
    },
    exit: {
      x: "-50vw",
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
      {/* This Section shows the different mic pages */}
      <div className="mic-page-cntr">
        <div className="mic-btn-ctnr">
          <HomeButton />
          <motion.button
            className="settings-btn"
            onClick={handleClick}
            animate={spin ? "spin" : "idle"}
            variants={spinVariants}
            whileTap={{
              transition: {
                duration: 0.6,
                ease: "easeInOut",
                times: [0, 0.2, 1],
              },
            }}
          >
            <IoMdSettings size={24} />
          </motion.button>
        </div>

        {/* This section is for the MicButton and front display page to talk to Cuate */}
        <div className="mic-page-wrapper">
          <div className="mic-page-title-cntr">
            <h1 className={`mic-page-title ${mode}`}>
              {mode === "conversation" && "Conversations"}
              {mode === "translation" && "Translations"}
              {mode === "qna" && "Q & A"}
            </h1>
            <p className="mic-page-info">
              {mode === "conversation" &&
                "Roleplay with Cuate to practice everyday conversations."}
              {mode === "translation" &&
                "Translate what Cuate says in English or Spanish."}
              {mode === "qna" &&
                "Answer Cuate's questions to reinforce understanding."}
            </p>
          </div>
          <div>
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="start-btn"
              onClick={onStart}
            >
              Start
            </motion.button>
          </div>
        </div>

        {/* The section below is to show the settings page to be displayed and slides in */}

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="settings-backdrop"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.4, duration: 0.3 },
                }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              />
              <motion.div
                className="settings-page"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={panelVariants}
              >
                <div className="settings-title-cntr">
                  <p className="settings-title">SETTINGS</p>
                  <div className="exit-btn" onClick={() => setIsOpen(false)}>
                    <RxCross1 size={24} />
                  </div>
                </div>

                {/* The settings Tab actually shows the different settings that can be displayed at all times */}
                <SettingsTab />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
