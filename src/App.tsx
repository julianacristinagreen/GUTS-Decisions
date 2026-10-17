import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Game from "./pages/game/game";
import DecisionTree from "./pages/decision-tree/decisionTree";
import WelcomePage from "./pages/welcome/welcome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/decisiontree" element={<DecisionTree />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
