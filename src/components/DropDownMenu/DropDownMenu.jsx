import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

import ItemCheckbox from "../ItemCheckbox/ItemCheckbox.jsx";

import "./DropDownMenu.css";

export default function DropDownMenu({ title, info }) {
  const [isOpen, setIsOpen] = useState(false);
  const [numCheckedItems, setNumCheckedItems] = useState(() => {
    return info?.filter((item) => item.active)?.length || 0;
  });

  const isLeafLevel = info.every(
    (item) => "english" in item && "spanish" in item
  );

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll((prev) => {
      const newSelectAll = !prev;
      setNumCheckedItems(newSelectAll ? info.length : 0);
      return newSelectAll;
    });
  };

  return (
    <>
      <div className="drop-down-menu">
        <label>{title}</label>
        <div className="drop-down-ui-tab">
          {numCheckedItems > 0 ? (
            <div className="drop-down-notification">
              {numCheckedItems < 100 ? numCheckedItems : "99+"}
            </div>
          ) : null}
          {isLeafLevel ? (
            <button className="select-all-btn" onClick={handleSelectAll}>
              {selectAll ? "Deselect All" : "Select All"}
            </button>
          ) : null}
          <motion.div
            className="drop-down-arrow"
            onClick={() => setIsOpen((prev) => !prev)}
            animate={{ rotate: isOpen ? -180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <IoMdArrowDropdown size={32} />
          </motion.div>
        </div>
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
                return (
                  <DropDownMenu
                    key={index}
                    title={data.category}
                    info={data.items}
                  />
                );
              } else if ("english" in data && "spanish" in data) {
                return (
                  <ItemCheckbox
                    key={data.id}
                    data={data}
                    setNumCheckedItems={setNumCheckedItems}
                    selectAll={selectAll}
                  />
                );
              } else {
                return <div key={index}>Words</div>;
              }
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
