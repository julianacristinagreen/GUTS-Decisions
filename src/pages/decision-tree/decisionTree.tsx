import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChoiceButton } from "../../components/buttons/buttons";
import { allDecisions } from "../../engine/cards";
import { decisionsInFullLife, newGame } from "../../engine/engine";
import { randomSeed } from "../../engine/rng";
import type { GameState } from "../../engine/types";
import { allChoices, branchesFor, lifePath, point, SIZE } from "../../utils/lifeTree";
import "./decisionTree.css";

// 2^30 branches can't be drawn, so only the first few levels of are shown
const SHOWN_LEVELS = 9;

export default function DecisionTree() {
    const location = useLocation();
    const navigate = useNavigate();
    const game: GameState | null = location.state?.game ?? null;

    // Step 0 is the overview with the numbers; steps 1..n are the player's decisions
    const [step, setStep] = useState(0);
    const steps = game?.history.length ?? 0;

    const newLife = () => navigate("/game", { state: { game: newGame(randomSeed()) } });
    const earlier = () => (step === 0 ? newLife() : setStep(step - 1));
    const later = () => (step === steps ? newLife() : setStep(step + 1));

    if (!game || steps === 0) {
        return <p>No life found. Please start a new game.</p>;
    }

    const picks = game.history.map((h) => h.picked);
    const branches = branchesFor(picks);
    const choices = allChoices(steps, Math.min(steps, SHOWN_LEVELS));

    // The node for the current decision on the overview
    const here = point(step === 0 ? steps : step - 1, branches[step === 0 ? steps : step - 1], steps);

    const wholeLife = decisionsInFullLife();
    const entry = step > 0 ? game.history[step - 1] : null;
    const decision = entry ? allDecisions.find((d) => d.id === entry.decisionId) : null;

    return (
        <div className="reveal">
            <svg className="reveal-tree" viewBox={`-10 -10 ${SIZE + 20} ${SIZE + 20}`}>
                {choices.map(({ level, d }) => (
                    <path key={d} className="reveal-branch" d={d} opacity={1 - 0.7 * (level / SHOWN_LEVELS)} />
                ))}
                <path className="reveal-life" d={lifePath(picks)} />
                <circle className="reveal-here" cx={here.x} cy={here.y} r={7} />
            </svg>

            <div className="reveal-text">
                {step === 0 ? (
                    <p className="reveal-number">
                        You made <b>{steps}</b> choices. There were {(2 ** steps).toLocaleString()} ways those
                        years could have gone, and {(2 ** wholeLife).toLocaleString()} ways a whole life could.
                        The power of two buttons...
                    </p>
                ) : (
                    <>
                        <p className="reveal-age">Age {entry!.age}</p>
                        <p className="reveal-question">{decision?.prompt}</p>
                        <p className="reveal-picked">
                            {entry!.picked === "left" ? decision?.leftCard.label : decision?.rightCard.label}
                        </p>
                        <p className="reveal-unpicked">
                            {entry!.picked === "left" ? decision?.rightCard.label : decision?.leftCard.label}
                        </p>
                    </>
                )}
            </div>

            <section className="reveal-buttons" aria-label="Choose an option">
                <ChoiceButton option="a" text={step === 0 ? "New life" : "Earlier"} onClick={earlier} />
                <ChoiceButton option="b" text={step === steps ? "New life" : "Later"} onClick={later} />
            </section>
        </div>
    );
}
