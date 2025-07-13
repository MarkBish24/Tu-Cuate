import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Pages/Home/Home.jsx";
import Conversation from "./components/Pages/Conversation/Conversation.jsx";
import QA from "./components/Pages/QA/QA.jsx";
import Translation from "./components/Pages/Translation/Translation.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conversation" element={<Conversation />} />
        <Route path="/qa" element={<QA />} />
        <Route path="/translation" element={<Translation />} />
      </Routes>
    </Router>
  );
}

export default App;
