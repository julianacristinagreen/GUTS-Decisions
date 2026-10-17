import type { NewGame, Choose, Decision, HistoryEntry, Stats } from "./types";
import { allDecisions } from "./cards";
import { rngFor } from "./rng";

const START_STATS: Stats = { happiness: 50, wealth: 50, health: 50, social: 50, energy: 50 };
const MAX_AGE = 60;

const ageStep = (age: number) => (age < 18 ? 3 : age < 35 ? 1 : 4);
const clamp = (n: number) => Math.min(100, Math.max(0, n));

export const generateDecision = (seed: string, age: number, history: HistoryEntry[]): Decision | null => {
    const seen = new Set(history.map(h => h.decisionId));
    const validPool = allDecisions.filter(d => d.minAge <= age && age <= d.maxAge && !seen.has(d.id));
    if (validPool.length === 0) return null;
    const rng = rngFor(seed, age);
    return validPool[Math.floor(rng() * validPool.length)];
}

export const newGame: NewGame = (seed) => ({
    seed,
    age: 0,
    stats: { ...START_STATS },
    alive: true,
    currentDecision: generateDecision(seed, 0, []),
    history: [],
    causeOfDeath: null,
});

export const choose: Choose = (state, pick) => {
    // Check whether alive 
    const decision = state.currentDecision;
    if (!state.alive || !decision) return state;

    const card = pick === "left" ? decision.leftCard : decision.rightCard;

    const stats: Stats = {
        happiness: clamp(state.stats.happiness + (card.effect.happiness ?? 0)),
        wealth: clamp(state.stats.wealth + (card.effect.wealth ?? 0)),
        health: clamp(state.stats.health + (card.effect.health ?? 0)),
        social: clamp(state.stats.social + (card.effect.social ?? 0)),
        energy: clamp(state.stats.energy + (card.effect.energy ?? 0)),
    };

    const history = [...state.history, { age: state.age, decisionId: decision.id, picked: pick }];

    const deadStat = (Object.keys(stats) as (keyof Stats)[]).find(k => stats[k] === 0);
    if (deadStat) {
        return { ...state, stats, history, alive: false, currentDecision: null, causeOfDeath: deadStat };
    }

    // Skip forward a year at a time until a card matches or the life runs out
    let age = state.age + ageStep(state.age);
    let nextDecision = null;
    while (!nextDecision && age <= MAX_AGE) {
        nextDecision = generateDecision(state.seed, age, history);
        if (!nextDecision) age++;
    }

    if (!nextDecision) {
        return { ...state, stats, history, age: MAX_AGE, alive: false, currentDecision: null, causeOfDeath: "old-age" };
    }

    return { ...state, age, stats, history, currentDecision: nextDecision };
}
