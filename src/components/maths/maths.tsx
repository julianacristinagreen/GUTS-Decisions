import { useState, useEffect } from "react";
import "./math.css";

type MathProps = {
  onSuccess: () => void;
  onFailure: () => void;
};

export default function Maths({ onSuccess, onFailure }: MathProps) {
  const [value, setValue] = useState("");
  const [answered, setAnswered] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  const success = submitted && Number(value) === 39;

  function checkAnswer() {
    if (value.trim() === "" || answered) return;

    setSubmitted(true);
    setAnswered(true);
  }

  useEffect(() => {
    if (answered) return;

    if (timeLeft === 0) {
      setAnswered(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, answered]);

  return (
    <div className="mathOverlay">
      <div className="mathContainer">
        <p>Answer the math question in 10 seconds to pass!</p>

        <p>
          Time remaining: {timeLeft}s
        </p>

        <div className="math">
          <p>15 + (2 * 12) = ????</p>

          {!answered && (
            <>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your answer"
              />

              <button onClick={checkAnswer}>
                Submit Answer
              </button>
            </>
          )}
        </div>

        {answered && success && (
          <>
            <p>Correct!</p>

            <button
              className="continueButton"
              onClick={onSuccess}
            >
              Continue
            </button>
          </>
        )}

        {answered && !success && (
          <>
            <p>
              {timeLeft === 0
                ? "Time's up! You didn't answer in time."
                : "Incorrect... I think you need to work on your math skills!"}
            </p>

            <button
              className="continueButton"
              onClick={onFailure}
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}