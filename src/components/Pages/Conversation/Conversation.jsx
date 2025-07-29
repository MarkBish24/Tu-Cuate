import { useEffect } from "react";
import { useMode } from "../../../contexts/ModeContext.jsx";
import PageWrapper from "../PageWrapper/PageWrapper.jsx";
import "./Conversation.css";

export default function Conversation() {
  const { setMode } = useMode();

  useEffect(() => {
    setMode("conversation");
  }, [setMode]);

  return <PageWrapper />;
}
