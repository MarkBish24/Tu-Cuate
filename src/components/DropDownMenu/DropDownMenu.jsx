import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

import "./DropDownMenu.css";

export default function DropDownMenu({ title, info, includeInfo }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="drop-down-menu">
        <label>{title}</label>
        <motion.div
          className="drop-down-arrow"
          onClick={() => setIsOpen((prev) => !prev)}
          animate={{ rotate: isOpen ? -180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <IoMdArrowDropdown size={32} />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="info-list-cntr"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", padding: "3px 20px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {info.map((data, index) => {
              if ("category" in data && "items" in data) {
                return <DropDownMenu title={data.category} info={data.items} />;
              } else if ("english" in data && "spanish" in data) {
                return (
                  <label className="drop-down-info-item" key={index}>
                    <p className="drop-down-info-p">
                      {data.spanish} -
                      <span style={{ fontStyle: "italic" }}>
                        - {data.english}
                      </span>
                    </p>
                    <input type="checkbox" />
                  </label>
                );
              } else {
                return null;
              }
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
