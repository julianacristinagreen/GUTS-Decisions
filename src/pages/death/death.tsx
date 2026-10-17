import { useLocation, useNavigate } from "react-router-dom";
import { ChoiceButton } from "../../components/buttons/buttons";
import { newGame } from "../../engine/engine";
import type { GameState, Stats } from "../../engine/types";
import "./death.css";

const RAN_OUT: Record<keyof Stats, string> = {
    happiness: "Your happiness ran out.",
    wealth: "Your money ran out.",
    health: "Your health ran out.",
    social: "Your friends ran out.",
    energy: "Your energy ran out.",
};

function getCauseOfDeathText(game: GameState): string {
    if (!game.causeOfDeath || game.causeOfDeath === "old-age") {
        return "You lived to 60.";
    }
    return `You died at ${game.age}. ${RAN_OUT[game.causeOfDeath]}`;
}

export default function Death() {
    const location = useLocation();
    const navigate = useNavigate();
    const game: GameState | null = location.state?.game ?? null;

    if (!game) {
        return <p>No game found. Please start a new game.</p>;
    }

    // Same seed, same world and the player may choose differently this time
    const liveAgain = () => navigate("/game", { state: { game: newGame(game.seed) } });
    const reveal = () => navigate("/decisiontree", { state: { game } });

    return (
        <div className="death">
            <h1>{getCauseOfDeathText(game)}</h1>

            <p className="death-question">Would you live this exact life again?</p>

            <section className="choices" aria-label="Choose an option">
                <ChoiceButton option="a" text="Live it again" onClick={liveAgain} />
                <ChoiceButton option="b" text="No" onClick={reveal} />
            </section>
        </div>
    );
}
