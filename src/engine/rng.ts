import seedrandom from "seedrandom";

// Generate random choices
export const rngFor = (seed: string, age: number) => seedrandom(`${seed}:${age}`);
