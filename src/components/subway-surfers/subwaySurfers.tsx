// Game code from https://github.com/VAIBHAV-2303/SubwaySurfers (changed to only use the left and right arrow keys)

import { useEffect, useRef, useState } from "react";
import ChaseGame from "./game/chase";
import "./subwaySurfers.css";

type SubwaySurfersProps = {
    seed: string;
    age: number;
    onSuccess: () => void;
    onFailure: () => void;
};

const GOAL = 15;

export default function SubwaySurfers({seed, age, onSuccess, onFailure}: SubwaySurfersProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const game = new ChaseGame(
            canvasRef.current!,
            seed,
            age,
            GOAL,
            (newScore) => setScore(newScore),
            (result) => {
                setSuccess(result === "escaped");
                setFinished(true);
            }
        );

        function handleKeyDown(e: KeyboardEvent) {
            if (e.code !== "ArrowLeft" && e.code !== "ArrowRight") {
                return;
            }

            e.preventDefault();

            // The first arrow key starts the chase
            game.start();
            setStarted(true);

            if (e.code === "ArrowLeft") {
                game.moveLeft();
            }
            else {
                game.moveRight();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            game.stop();
        };
    }, [seed, age]);

    return (
        <div className="chase-overlay">
        <div className="chaseGame">
            <h2 className="chase-title">
                Run from the police!
            </h2>

            <p className="chase-instructions">
                Use the LEFT and RIGHT arrow keys to change lanes. Collect {GOAL} coins to get away!
                Avoid the trains and try not to hit the cones.
            </p>

            <div className="chase-stats">
                <span className="chase-stat-label">
                    Coins:
                </span>

                <span className="chase-stat-value">
                    {score} / {GOAL}
                </span>
            </div>

            <canvas className="chase-canvas" ref={canvasRef} width={640} height={480}></canvas>

            <div className="chase-message">
                {!started && (
                    "Press the LEFT or RIGHT arrow key to start!"
                )}

                {started && !finished && (
                    "Keep running!"
                )}

                {finished && success && (
                    <>
                        <p>You got away with {score} coins!</p>
                        <button className="continueButton" onClick={onSuccess}>Continue</button>
                    </>
                )}

                {finished && !success && (
                    <>
                        <p>The police caught you with only {score} coins.</p>
                        <button className="continueButton" onClick={onFailure}>Continue</button>
                    </>
                )}
            </div>
        </div>
        </div>
    );
}
