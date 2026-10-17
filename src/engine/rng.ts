import seedrandom from "seedrandom";

export const rngFor = (seed: string, age: number) => seedrandom(`${seed}:${age}`);
