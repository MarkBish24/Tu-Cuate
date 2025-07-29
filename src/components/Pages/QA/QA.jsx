import { useEffect } from "react";
import { useMode } from "../../../contexts/ModeContext.jsx";
import PageWrapper from "../PageWrapper/PageWrapper.jsx";
import "./QA.css";

export default function QA() {
  const { setMode } = useMode();

  useEffect(() => {
    setMode("qna");
  }, [setMode]);

  return <PageWrapper />;
}
