import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Game from "./pages/game/game";
import Death from "./pages/death/death";
import DecisionTree from "./pages/decision-tree/decisionTree";
import WelcomePage from "./pages/welcome/welcome";
import Dice from "./components/dice/dice";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/dice" element={<Dice />} />
        <Route path="/game" element={<Game />} />
        <Route path="/death" element={<Death />} />
        <Route path="/decisiontree" element={<DecisionTree />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
