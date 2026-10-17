export interface GameState {
    age: number;
    stats: Stats;
    alive: boolean;
    currentDecision: Decision | null;
    history: HistoryEntry[];
}

export interface HistoryEntry {
    age: number;
    decisionId: string;
    picked: "left" | "right";
}

export interface Decision {
    id: string;
    prompt: string;
    leftCard: Card;
    rightCard: Card;
    minAge: number;
    maxAge: number;
}

export interface Card {
    label: string;
    effect: Partial<Stats>;
    outcome: string;
}

export interface Stats {
    happiness: number;
    wealth: number;
    health: number;
    social: number;
    energy: number;
}

// Engine API
export type NewGame = (seed: string) => GameState;
export type Choose = (state: GameState, pick: "left" | "right") => GameState;
