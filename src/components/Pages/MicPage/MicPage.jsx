import { useState } from "react";

import HomeButton from "../../HomeButton/HomeButton.jsx";
import Microphone from "../../microphone/microphone.jsx";
import { IoMdSettings } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { RxCross1 } from "react-icons/rx";

import "./MicPage.css";

export default function MicPage() {
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
      x: "-42vw",
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
      x: "-42vw",
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
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
      <div>
        <div className="mic-page-title">
          <h1>Title</h1>
          <p>Press the microphone to continue</p>
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
            <div className="exit-btn" onClick={() => setIsOpen(false)}>
              <RxCross1 size={24} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
