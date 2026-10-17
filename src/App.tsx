
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./frontend/game";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
