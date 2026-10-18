import { useEffect, useState, type ComponentType } from "react";
import * as DicePackage from "react-dice-roll";
import "./dice.css";

type DiceGameProps = {
  onRoll: (value: number) => void;
  onSuccess: () => void;
  onFailure: () => void;
};

const Dice = (
  DicePackage.default as unknown as { default: ComponentType<any> }
).default;

export default function DiceGame({onRoll, onSuccess, onFailure}: DiceGameProps) {
  const [success, setSuccess] = useState(false);
  const [value, setValue] = useState(0);
  const [rolled, setRolled] = useState(false);

    useEffect(() => {
        if (value > 4) {
            setSuccess(true);
        }
        else {
            setSuccess(false);
        }
    }, [value, rolled]);

  return (
    <div className="diceOverlay">
    <div className="diceContainer">
    <p>Roll the dice! If you roll greater than 4, you will take the chance on the garage!</p>
    <div className="dice">
    <Dice
      size={100}
      triggers={rolled ? [] : ["click"]}
      onRoll={(rollValue: number) => {
        if (rolled) return;
        setValue(rollValue);
        setRolled(true);
        onRoll(rollValue);
        }}
    />
    </div>
    {rolled && success && (
        <>
            <p>Success! You rolled high enough (You rolled a {value}) to take the chance on the garage!</p>
            <button className="continueButton" onClick={onSuccess}>Continue</button>
        </>
    )}

    {rolled && !success && (
        <>
            <p>You did not roll high enough (You rolled a {value}) and therefore did not take the chance. You decided to take the safe route to go to university.</p>
            <button className="continueButton" onClick={onFailure}>Continue</button>
        </>
    )}
    </div>
    </div>
  );
}