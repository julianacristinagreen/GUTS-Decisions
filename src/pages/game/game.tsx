import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stats from "../../components/stats/stats";
import Card from "../../components/card/card";
import { OutcomePopup } from "../../components/popup/popup";
import { Banner } from "../../components/banner/banner";
import { ChoiceButton } from "../../components/buttons/buttons";
import { choose } from "../../engine/engine";
import type { GameState } from "../../engine/types";
import "./game.css";
import ButtonMasher from "../../components/button-masher/buttonMasher";

export default function Game() {
    const location = useLocation();
    const navigate = useNavigate();
    const [game, setGame] = useState<GameState | null>(location.state?.game ?? null);
    const [outcome, setOutcome] = useState("");
    const [pendingGame, setPendingGame] = useState<GameState | null>(null);
    const [hovered, setHovered] = useState<"left" | "right" | null>(null);
    const [showMasher, setShowMasher] = useState(false);

    useEffect(() => {
        if (game && !game.alive) {
            navigate("/death", { state: { game } });
        }
    }, [game, navigate]);

    if (!game) {
        return <p>No game found. Please start a new game.</p>;
    }

    const question = game.currentDecision;
    const makeChoice = (pick: "left" | "right") => {
        if (pendingGame) return;
        setOutcome(pick === "left" ? question!.leftCard.outcome : question!.rightCard.outcome);
        setPendingGame(choose(game, pick));
    }

    const finishOutcome = () => {
        setGame(pendingGame);
        setPendingGame(null);
    }

    const effect = hovered === "left" ? question?.leftCard.effect : hovered === "right" ? question?.rightCard.effect :null;

    return (
        <>
        <Banner game={game}/>

        <div className="game-row">
            {question && <Card question={question} />}
            <Stats stats={game.stats} previewEffect={effect ?? null}/>
        </div>

            {question ? (
                <>
                    <div className="choices">
                        {question.id === "teen-sport" ? (
                        <button className="teamTrial" onClick={() => setShowMasher(true)}>
                            Start Team Trial
                        </button>
                        ) : ( <>
                        <ChoiceButton
                            option="a"
                            text={question.leftCard.label}
                            onClick={() => makeChoice("left")}
                            onMouseEnter={() => setHovered("left")}
                            onMouseLeave={() => setHovered(null)}
                        />
                        <ChoiceButton
                            option="b"
                            text={question.rightCard.label}
                            onClick={() => makeChoice("right")}
                            onMouseEnter={() => setHovered("right")}
                            onMouseLeave={() => setHovered(null)}
                        />
                        </>
                        )}

                        {showMasher && (
                            <ButtonMasher
                                onSuccess={() => {
                                    setShowMasher(false);
                                    makeChoice("left");
                                }}
                                onFailure={() => {
                                    setShowMasher(false);
                                    makeChoice("right");
                                }}
                            />
                        )}
                    </div>
                </>
            ) : (
                <p>{game.alive ? "There are no more decisions." : "Game over."}</p>
            )}

            { pendingGame && (
                <OutcomePopup
                    outcome={outcome}
                    onFinished={finishOutcome}
                />
            )}
        </>
    );
}