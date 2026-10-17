import "./css/card.css"
import type { Decision } from "../engine/types";

type CardProps = {
    question: Decision;
};

export default function Card({ question }: CardProps) {
    console.log(question);
    return(
        <div className="card-div">
            <h1 className="card-h1">{question.prompt}</h1>
            <p className="card-p">What will you do?...</p>
            {/* <p>{question.leftCard.label} OR {question.rightCard.label}</p> */}
        </div>
    )
}