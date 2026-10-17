import "./buttons.css";

type ChoiceButtonProps = {
  option: "a" | "b";
  text: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export function ChoiceButton({ option, text, onClick, onMouseEnter, onMouseLeave }: ChoiceButtonProps) {
  return (
    <button
      className={`choice choice-${option}`}
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* <span className="choice-key">Option: {option.toUpperCase()}</span> */}
      <span className="choice-text">{text}</span>
    </button>
  );
}