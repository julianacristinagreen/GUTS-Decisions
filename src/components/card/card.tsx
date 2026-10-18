import "./card.css"
import type { Decision } from "../../engine/types";

type CardProps = {
    question: Decision;
};

export default function Card({ question }: CardProps) {
    return(
        <div className="card-div">
            <h1 className="card-h1">{question.prompt}</h1>
            <p className="card-p">What will you do?...</p>
        </div>
    )
}