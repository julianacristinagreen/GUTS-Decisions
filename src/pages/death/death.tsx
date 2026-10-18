import { useLocation, useNavigate } from "react-router-dom";
import { ChoiceButton } from "../../components/buttons/buttons";
import Stats from "../../components/stats/stats";
import { newGame } from "../../engine/engine";
import type { GameState, Stats as StatValues } from "../../engine/types";
import "./death.css";

const RAN_OUT: Record<keyof StatValues, string> = {
    happiness: "Your happiness ran out.",
    wealth: "Your money ran out.",
    health: "Your health ran out.",
    social: "Your friends ran out.",
    energy: "Your energy ran out.",
};

function getCauseOfDeathText(game: GameState): { headline: string; cause: string } {
    if (!game.causeOfDeath || game.causeOfDeath === "old-age") {
        return { headline: "You lived to 60.", cause: "You made it!" };
    }
    return { headline: `You died at ${game.age}.`, cause: RAN_OUT[game.causeOfDeath] };
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

    const { headline, cause } = getCauseOfDeathText(game);

    return (
        <div className="death">
            <div className="death-heading">
                <h1>{headline}</h1>
                <p className="death-cause">{cause}</p>
            </div>

            <div className="death-stats">
                <Stats stats={game.stats} previewEffect={null} />
            </div>

            <p className="death-question">Would you live this exact life again?</p>

            <section className="death-buttons" aria-label="Choose an option">
                <ChoiceButton option="a" text="Live it again" onClick={liveAgain} />
                <ChoiceButton option="b" text="No" onClick={reveal} />
            </section>
        </div>
    );
}
