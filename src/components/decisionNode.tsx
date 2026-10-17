import "./css/decisionNode.css"
type DecisionNodeProps = {
    picked: string;
    choices: string[];
    children?: React.ReactNode;
    question: string;
};

export default function DecisionNode({
    picked,
    choices,
    children,
    question
}: DecisionNodeProps) {
    return (
        <div className="decisionNode">
        <p>{question}</p>
        <div className="option">
            <div className={`decision-div ${picked === "left" ? "selected" : ""}`}>
                <p className="decision-p">{choices[0]}</p>
            </div>
            <div className={`decision-div ${picked === "right" ? "selected" : ""}`}>
                <p className="decision-p">{choices[1]}</p>
            </div>
            </div>
                {children && (
                <div className="nextDecision">
                    {children}
                </div>
            )}
        </div>
    )
}