import seedrandom from "seedrandom";

export const rngFor = (seed: string, age: number) => seedrandom(`${seed}:${age}`);

// A random seed for each new life 
export const randomSeed = () => Math.random().toString(36).slice(2, 10);