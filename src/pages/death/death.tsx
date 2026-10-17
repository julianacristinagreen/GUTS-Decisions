import { useLocation } from "react-router-dom";
import type { GameState } from "../../engine/types";
import "./death.css";

export default function Death() {
    const location = useLocation();
    const game: GameState | null = location.state?.game ?? null;

    if (!game) {
        return <p>No game found. Please start a new game.</p>;
    }

    return (
        <div className="death">
            <h1>You died</h1>
            <p>Cause of death: {game.causeOfDeath}</p>
        </div>
    );
}
