import DecisionNode from "../components/decisionNode";
import { allDecisions } from "../engine/cards";
import type { GameState, HistoryEntry } from "../engine/types";

export default function DecisionTree({game}:{game:GameState}){
    
    let historyChoices = game.history;
    
    return(
        historyChoices.forEach((choice : HistoryEntry) => {
            allDecisions.forEach(decision => {
                if (choice.decisionId == decision.id){
                    <DecisionNode choices = {[decision.leftCard.label, decision.rightCard.label]}/>
                }
            });
        })
    )
}