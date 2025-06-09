import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Main } from "./plot/main";
import { Plot } from "./plot/plot";
import "./css/main.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/plot" element={<Plot />} />
      </Routes>
    </Router>
  );
}

export default App;