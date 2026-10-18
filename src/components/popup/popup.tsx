import "./popup.css"

type PopupProps = {
    outcome: string;
    onFinished: () => void;
}

export function OutcomePopup({ outcome, onFinished }: PopupProps) {
    return (
        <div className="popup-container" onAnimationEnd={onFinished}>
            <h3 className="popup-text">{outcome}</h3>
        </div>
    )
}