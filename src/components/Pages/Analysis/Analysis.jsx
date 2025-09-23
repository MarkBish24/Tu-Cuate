import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMode } from "../../../contexts/ModeContext.jsx";

import HomeButton from "../../HomeButton/HomeButton.jsx";
import "./Analysis.css";

export default function Analysis() {
  const { setMode } = useMode();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [timeframe, setTimeframe] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setMode("analysis");

    const fetchData = async () => {
      try {
        const startDate = "2025-09-01T00:00:00Z";
        const endDate = "2025-09-15T23:59:59Z";

        const result = await window.electronAPI.getNLPData(timeframe);

        if (result.success) {
          setData(result.data.data);
          setCategories(result.data.categories);
          console.log(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch Spanish data:", err);
      }
    };
    if (timeframe !== null) {
      fetchData();
    }
  }, [setMode, timeframe]);

  const options = [
    { label: "Today", value: "1" },
    { label: "Week", value: "7" },
    { label: "Month", value: "30" },
    { label: "All Time", value: "all" },
  ];

  return (
    <>
      <motion.div
        key="analysis"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <HomeButton />
        <div className="timeframe-switch">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className={`timeframe-btn ${
                opt.value === timeframe ? "selected" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div>
          {data.map((mistake, index) => (
            <div key={index}>
              <strong>{mistake.category}</strong>: {mistake.originalMistake} →{" "}
              {mistake.correction}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
