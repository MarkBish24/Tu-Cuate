import { useState } from "react";

import HomeButton from "../../HomeButton/HomeButton.jsx";
import Microphone from "../../microphone/microphone.jsx";
import { IoMdSettings } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { RxCross1 } from "react-icons/rx";

import "./MicPage.css";

export default function MicPage({ title }) {
  const [spin, setSpin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setSpin(true);
    setIsOpen((prev) => !prev);
    setTimeout(() => setSpin(false), 600);
  };

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
        <div className="mic-page-wrapper">
          <div className="mic-page-title-cntr">
            <h1 className="mic-page-title">{title}</h1>
            <p className="mic-page-info">
              Press the microphone button to talk to Cuate
            </p>
          </div>
          <Microphone />
        </div>

        <AnimatePresence>
          {isOpen && (
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
