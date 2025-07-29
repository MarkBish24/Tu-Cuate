import { createContext, useContext, useState } from "react";

const ModeContext = createContext();

export function useMode() {
  return useContext(ModeContext);
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState("default");

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}
