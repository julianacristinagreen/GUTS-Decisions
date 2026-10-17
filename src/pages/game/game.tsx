import { useState } from "react";
import { useLocation } from "react-router-dom";
import Stats from "../../components/stats/stats";
import Card from "../../components/card/card";
import { ChoiceButton } from "../../components/buttons/buttons";
import { choose } from "../../engine/engine";
import type { GameState } from "../../engine/types";

export default function Game() {
    const location = useLocation();
    const [game, setGame] = useState<GameState | null>(location.state?.game ?? null);

    if (!game) {
        return <p>No game found. Please start a new game.</p>;
    }

    const question = game.currentDecision;

    const makeChoice = (pick: "left" | "right") => {
        const nextGame = choose(game, pick);
        setGame(nextGame);
    }

    return (
        <>
        <Stats stats={game.stats}/>

            {question ? (
                <>
                    <Card question={question} />

                    <section className="choices" aria-label="Choose an option">
                        <ChoiceButton
                            option="a"
                            text={question.leftCard.label}
                            onClick={() => makeChoice("left")}
                        />
                        <ChoiceButton
                            option="b"
                            text={question.rightCard.label}
                            onClick={() => makeChoice("right")}
                        />
                    </section>
                </>
            ) : (
                <p>{game.alive ? "There are no more decisions." : "Game over."}</p>
            )}
        </>
    );
}