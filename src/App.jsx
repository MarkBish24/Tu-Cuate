import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Pages/Home/Home.jsx";
import Analysis from "./components/Pages/Analysis/Analysis.jsx";
import QA from "./components/Pages/QA/QA.jsx";
import Translation from "./components/Pages/Translation/Translation.jsx";
import "./App.css";

// main app has a home page and three different modes and the modes switch with the ModeContext.js

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/qa" element={<QA />} />
        <Route path="/translation" element={<Translation />} />
      </Routes>
    </Router>
  );
}

export default App;
