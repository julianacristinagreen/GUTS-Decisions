import { useLocation } from "react-router-dom";
import Stats from "../components/stats";
import Card from "../components/card";
import { generateDecision } from "../engine/engine";

export default function Game() {
    const location = useLocation();
    const game = location.state?.game;
    let firstDecision = true;
    let question = null;

    if (firstDecision) {
        question = generateDecision(game.seed, game.age, game.history);
        firstDecision = false;
    }

    if (!game) {
        return <p>No game found. Please start a new game.</p>;
    }

    return (
        <>
        <Stats stats={game.stats}/>

        <Card question={question}/>
        </>
    );
}