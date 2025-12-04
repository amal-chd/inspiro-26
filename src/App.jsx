import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import MoreInfo from './pages/MoreInfo';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary selection:text-white">
        <div className="film-grain"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/more-info" element={<MoreInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
