import type { Decision } from "./types";

const modules = import.meta.glob<Decision[]>("../content/cards/*.json", { eager: true, import: "default" });

export const allDecisions: Decision[] = Object.values(modules).flat();
