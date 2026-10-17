import { useLocation } from "react-router-dom";

export default function Game() {
    const location = useLocation();
    const game = location.state?.game;

    if (!game) {
        return <p>No game found. Please start a new game.</p>;
    }

    return (
        <div>
            <h1>Game</h1>
            <p>Age: {game.age}</p>
            <p>Alive: {game.alive ? "Yes" : "No"}</p>
        </div>
    );
}