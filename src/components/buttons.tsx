import "./css/buttons.css";

type ChoiceButtonProps = {
  option: "a" | "b";
  text: string;
  onClick: () => void;
};

export function ChoiceButton({ option, text, onClick }: ChoiceButtonProps) {
  return (
    <button
      className={`choice choice-${option}`}
      type="button"
      onClick={onClick}
    >
      <span className="choice-key">Option {option.toUpperCase()}</span>
      <span className="choice-text">{text}</span>
    </button>
  );
}