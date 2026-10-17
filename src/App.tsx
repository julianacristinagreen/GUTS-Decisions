
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./frontend/game";
import DecisionTree from "./frontend/decisionTree";
import WelcomePage from "./frontend/welcome";
import Stats from "./frontend/stats";

function Home() {
  return (
    <>
      <h1>GUT(S) Decisions</h1>
      <h3>Do you have the GUTS to make the decisions?</h3>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/decisiontree" element={<DecisionTree />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
