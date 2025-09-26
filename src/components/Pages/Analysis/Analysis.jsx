import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMode } from "../../../contexts/ModeContext.jsx";

import PieChart from "./Charts/PieChart.jsx";
import HomeButton from "../../HomeButton/HomeButton.jsx";
import "./Analysis.css";
import GroupedBarChart from "./Charts/GroupedBarChart.jsx";

export default function Analysis() {
  const { setMode } = useMode();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [timeframe, setTimeframe] = useState(null);

  useEffect(() => {
    setMode("analysis");

    const fetchData = async () => {
      try {
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
          <PieChart
            data={categories}
            valueKey="count"
            labelKey="category_standard"
            width={300}
            height={250}
          />
          <GroupedBarChart
            data={data}
            categories={categories}
            timeframe={timeframe}
          />
        </div>
      </motion.div>
    </>
  );
}
