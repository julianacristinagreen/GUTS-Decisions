import DecisionNode from "../../components/decision-node/decisionNode";
import { allDecisions } from "../../engine/cards";
import type { HistoryEntry } from "../../engine/types";

export default function DecisionTree() {
    const historyChoices: HistoryEntry[] = [
        { age: 12, decisionId: "adult-promotion", picked: "left" },
        { age: 13, decisionId: "adult-promotion", picked: "right" },
        { age: 13, decisionId: "adult-promotion", picked: "right" }
    ];

    function renderDecision(index: number): React.ReactNode {
        if (index >= historyChoices.length) {
            return null;
        }

        const choice = historyChoices[index];

        const decision = allDecisions.find(
            (d) => d.id === choice.decisionId
        );

        if (!decision) {
            return renderDecision(index + 1);
        }

        return (
            <DecisionNode
                key={`${choice.age}-${choice.decisionId}-${index}`}
                choices={[
                    decision.leftCard.label,
                    decision.rightCard.label
                ]}
                picked={choice.picked}
                question={decision.prompt}
                children={renderDecision(index + 1)}
            >
            </DecisionNode>
        );
    }

    return (
        <div className="decisionTree">
            {renderDecision(0)}
        </div>
    );
}