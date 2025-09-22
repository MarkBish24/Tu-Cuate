import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMode } from "../../../contexts/ModeContext.jsx";

import HomeButton from "../../HomeButton/HomeButton.jsx";
import "./Analysis.css";

export default function Analysis() {
  const { setMode } = useMode();
  const [data, setData] = useState([]);

  useEffect(() => {
    setMode("analysis");

    const fetchData = async () => {
      try {
        const startDate = "2025-09-01T00:00:00Z";
        const endDate = "2025-09-15T23:59:59Z";

        const result = await window.electronAPI.getNLPData();

        if (result.success) {
          setData(result.data);
          console.log(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch Spanish data:", err);
      }
    };
    fetchData();
  }, [setMode]);

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
