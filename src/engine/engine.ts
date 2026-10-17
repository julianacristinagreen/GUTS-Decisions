import type { NewGame, Choose, Decision, HistoryEntry } from "./types";
import { allDecisions } from "./cards";
import { rngFor } from "./rng";

export const generateDecision = (seed: string, age: number, history: HistoryEntry[]): Decision | null => {
    const seen = new Set(history.map(h => h.decisionId));
    const validPool = allDecisions.filter(d => d.minAge <= age && age <= d.maxAge && !seen.has(d.id));
    if (validPool.length === 0) return null;
    const rng = rngFor(seed, age);
    return validPool[Math.floor(rng() * validPool.length)];
}

export const newGame: NewGame = (seed) => {

}

export const choose: Choose = (state, pick) => {

}
