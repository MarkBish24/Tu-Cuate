import { useState } from "react";
import { motion } from "framer-motion";
import DropDownMenu from "../DropDownMenu/DropDownMenu.jsx";

import vocabData from "../../../server/data/vocab.json";
import tensesData from "../../../server/data/tenses.json";
import pronounData from "../../../server/data/pronouns.json";
import adverbsData from "../../../server/data/adverbs.json";

import "./SettingsTab.css";

export default function SettingsTab() {
  const [cefrValue, setCefrValue] = useState(1);
  const [hoveredCefr, setHoveredCefr] = useState(false);

  const [lengthValue, setLengthValue] = useState(10);
  const [hoveredLength, setHoveredLength] = useState(false);

  const cefrLabels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  return (
    <>
      <ul className="settings-panel">
        <li>
          <DropDownMenu title={"Verbs"} info={["", ""]} includeInfo={true} />
        </li>
        <li>
          <DropDownMenu
            title={"Adverbs"}
            info={adverbsData}
            includeInfo={true}
          />
        </li>
        <li>
          <DropDownMenu
            title={"Conjugation Tense"}
            info={tensesData}
            includeInfo={true}
          />
        </li>
        <li>
          <DropDownMenu
            title={"Pronouns"}
            info={pronounData}
            includeInfo={true}
          />
        </li>
        <li>
          <DropDownMenu title={"Vocab"} info={vocabData} includeInfo={true} />
        </li>
        <li className="settings-range">
          <label>CEFR Level</label>
          <div
            className="slider-container"
            onMouseEnter={() => setHoveredCefr(true)}
            onMouseLeave={() => setHoveredCefr(false)}
          >
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={cefrValue}
              onChange={(e) => setCefrValue(Number(e.target.value))}
            />
            <motion.div
              className="slider-popup"
              style={{ left: `${(cefrValue - 1) * 20}%` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                hoveredCefr
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.2 }}
            >
              {cefrLabels[cefrValue - 1]}
            </motion.div>
          </div>
        </li>
        <li className="settings-range">
          <label>Response Length in Words</label>
          <div
            className="slider-container"
            onMouseEnter={() => setHoveredLength(true)}
            onMouseLeave={() => setHoveredLength(false)}
          >
            <input
              type="range"
              min="10"
              max="150"
              step="1"
              value={lengthValue}
              onChange={(e) => setLengthValue(Number(e.target.value))}
            />
            <motion.div
              className="slider-popup"
              style={{
                left: `${((lengthValue - 10) / (150 - 10)) * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                hoveredLength
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.2 }}
            >
              {lengthValue}
            </motion.div>
          </div>
        </li>
      </ul>
    </>
  );
}
