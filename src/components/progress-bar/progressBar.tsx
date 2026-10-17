import "./progressBar.css";

type ProgressBarProps = {
    currentValue: number;
    label: string;
    maxValue: number;
    previewValue: number;
};

export const ProgressBar = ({
    currentValue,
    label,
    maxValue,
    previewValue
}: ProgressBarProps) => (
    <div className="progressContainer">
        <label className="label" htmlFor={`progress-${label}`}>{label} </label>
        <progress
            id={`progress-${label}`}
            value={currentValue}
            max={maxValue}
            className="progressBar"
        />

        {previewValue !== currentValue && (
            <progress
                value={previewValue}
                max={maxValue}
                className="progressBar previewBar"
            />
        )}
        <span className="valueFraction">{currentValue}/{maxValue}</span>
    </div>
);