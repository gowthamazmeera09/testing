import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import WorkersList from "./WorkersList";

function App() {
  return (
    <Router>
      <div>
        <h1>Workboard</h1>
        <nav>
          <Link to="/">Home</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/:role" element={<WorkersList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
