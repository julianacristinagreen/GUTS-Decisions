import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Game from "./frontend/game";
import DecisionTree from "./frontend/decisionTree";
import WelcomePage from "./frontend/welcome";
import Stats from "./components/stats";
import Card from "./components/card";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/decisiontree" element={<DecisionTree />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/components/card" element={<Card/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
