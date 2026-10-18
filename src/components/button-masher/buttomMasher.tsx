import { useEffect, useState } from "react";
import "./buttonMasher.css";

export default function ButtonMasher() {
    const [count, setCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);

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

    return (
        <div className="buttonMasher">
            <h2 className="game-title">
                Button Masher
            </h2>

            <p className="instructions">
                Press the SPACEBAR as many times as possible!
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
                {finished
                    ? `Complete! Total: ${count} presses`
                    : started
                        ? "Keep pressing SPACEBAR!"
                        : "Press SPACEBAR to start!"
                }
            </div>
        </div>
    );
}