import { useEffect, useState } from "react";
import "./buttonMasher.css";

type ButtonMasherProps = {
    onSuccess: () => void;
    onFailure: () => void;
};

export default function ButtonMasher({onSuccess, onFailure}: ButtonMasherProps) {
    const [count, setCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.code !== "Space") {
                return;
            }

            e.preventDefault();

            if (!started) {
                setStarted(true);
            }

            if (!finished) {
                setCount(prev => prev + 1);
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [started, finished]);

    useEffect(() => {
        if (!started || finished) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setFinished(true);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [started, finished]);

    useEffect(() => {
        if (finished) {
            const didSucceed = count >= 100;
            setSuccess(didSucceed);
        }
    }, [finished, count, onSuccess, onFailure]);

    return (
        <div className="masher-overlay">
        <div className="buttonMasher">
            <h2 className="game-title">
                Team Trial Minigame!
            </h2>

            <p className="instructions">
                Press the SPACEBAR at least 100 times in 15 seconds to get into the team!
            </p>

            <div className="game-stats">
                <div className="stat-item">
                    <span className="stat-label">
                        Presses:
                    </span>

                    <span className="stat-value">
                        {count}
                    </span>
                </div>

                <div className="stat-item">
                    <span className="stat-label">
                        Time:
                    </span>

                    <span className="stat-value">
                        {timeLeft}
                    </span>
                </div>
            </div>

            <div className="test-area">
                              {!started && (
                    "Press SPACEBAR to start!"
                )}

                {started && !finished && (
                    "Keep pressing SPACEBAR!"
                )}

                {finished && success && (
                        <>
                            <p>Success! You made it into the team with {count} presses!</p>
                            <button className="continueButton" onClick={onSuccess}>Continue</button>
                        </>
                )}

                {finished && !success && (
                    <>
                        <p>You failed! You only managed {count} presses.</p>
                        <button className="continueButton" onClick={onFailure}>Continue</button>
                    </>
                )}
            </div>
        </div>
        </div>
    );
}