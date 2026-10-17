import DecisionNode from "../components/decisionNode";

export default function DecisionTree(){
    
    let historyChoices = ["testing", "These", "Choices"];
    
    return(
        <>
            <h1>Your choices</h1>
            <DecisionNode choices={historyChoices}/>
        </>
    )
}