import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DropDownMenu from "../DropDownMenu/DropDownMenu.jsx";

import "./SettingsTab.css";

// The Settings tabs connects to the data base and allows the user which words, verbs, conjugation tense, etc to be active or not

export default function SettingsTab() {
  const [cefrValue, setCefrValue] = useState(1);
  const [hoveredCefr, setHoveredCefr] = useState(false);

  const [lengthValue, setLengthValue] = useState(10);
  const [hoveredLength, setHoveredLength] = useState(false);

  const cefrLabels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const [verbData, setVerbData] = useState([]);
  const [vocabData, setVocabData] = useState([]);
  const [adverbsData, setAdverbsData] = useState([]);
  const [tensesData, setTensesData] = useState([]);
  const [pronounData, setPronounData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const verbs = await window.electronAPI.getCollectionData("verbs");
      const vocab = await window.electronAPI.getCollectionData("vocab");
      const adverbs = await window.electronAPI.getCollectionData("adverbs");
      const tenses = await window.electronAPI.getCollectionData("tenses");
      const pronouns = await window.electronAPI.getCollectionData("pronouns");

      if (verbs.success) setVerbData(verbs.data);
      if (vocab.success) setVocabData(vocab.data);
      if (adverbs.success) setAdverbsData(adverbs.data);
      if (tenses.success) setTensesData(tenses.data);
      if (pronouns.success) setPronounData(pronouns.data);
    };

    loadData();
  }, []);

  return (
    <>
      <ul className="settings-panel">
        <li>
          <DropDownMenu title={"Verbs"} info={verbData} />
        </li>
        <li>
          <DropDownMenu title={"Adverbs"} info={adverbsData} />
        </li>
        <li>
          <DropDownMenu title={"Conjugation Tense"} info={tensesData} />
        </li>
        <li>
          <DropDownMenu title={"Pronouns"} info={pronounData} />
        </li>
        <li>
          <DropDownMenu title={"Vocab"} info={vocabData} />
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
              max="100"
              step="1"
              value={lengthValue}
              onChange={(e) => setLengthValue(Number(e.target.value))}
            />
            <motion.div
              className="slider-popup"
              style={{
                left: `${((lengthValue - 10) / (100 - 10)) * 100}%`,
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
