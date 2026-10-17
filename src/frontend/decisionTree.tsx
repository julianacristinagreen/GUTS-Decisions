import DecisionNode from "../components/decisionNode";
import { allDecisions } from "../engine/cards";
import type { GameState, HistoryEntry } from "../engine/types";

export default function DecisionTree({game}:{game:GameState}){
    let historyChoices: HistoryEntry[] = [
        {age: 12, decisionId: "adult-promotion", picked: "left"}
    ];
    // game.history;
    
    return(
        historyChoices.forEach((choice : HistoryEntry) => {
            console.info("I am trying to do nodes now");
            allDecisions.forEach(decision => {
                if (choice.decisionId == decision.id){
                    console.info("decision", decision.id);
                    <DecisionNode choices = {[decision.leftCard.label, decision.rightCard.label]}/>
                }
            });
        })
    )
}