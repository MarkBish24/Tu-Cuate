import { useEffect } from "react";
import { useMode } from "../../../contexts/ModeContext.jsx";
import PageWrapper from "../PageWrapper/PageWrapper.jsx";
import "./translation.css";

export default function Translation() {
  const { setMode } = useMode();

  useEffect(() => {
    setMode("translation");
  }, [setMode]);

  return <PageWrapper />;
}
