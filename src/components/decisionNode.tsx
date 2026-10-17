import "./css/decisionNode.css"

export default function DecisionNode({choices}:{choices:string[]}){
    return (
        <div className="option">
            <div className="decision-div">
                <p className="decision-p">{choices[0]}</p>
            </div>
            <div className="decision-div">
                <p className="decision-p">{choices[1]}</p>
            </div>
        </div>
    )
}