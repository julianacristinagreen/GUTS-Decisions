import "./css/progressBar.css";

type ProgressBarProps = {
    currentValue: number;
    label: string;
    maxValue: number;
};

export const ProgressBar = ({
    currentValue,
    label,
    maxValue
}: ProgressBarProps) => (
    <>
        <label className="label" htmlFor={`progress-${label}`}>{label} </label>
        <progress
            id={`progress-${label}`}
            value={currentValue}
            max={maxValue}
            className="progressBar"
        />
        <span className="valueFraction">{currentValue}/{maxValue}</span>
    </>
);