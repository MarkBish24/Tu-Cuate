import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Microphone from "./components/microphone/microphone.jsx";

import Home from "./components/Pages/Home/Home.jsx";
import Conversation from "./components/Pages/Conversation/Conversation.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conversation" element={<Conversation />} />
      </Routes>
    </Router>
  );
}

export default App;
