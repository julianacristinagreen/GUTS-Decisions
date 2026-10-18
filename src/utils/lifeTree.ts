// Builds the SVG paths for the decision trees on the welcome page and the reveal.
// The tree fits in a SIZE x SIZE box: the root sits on the left, and each level splits every branch into yes/no.
// Branch 0 at each level is the top; child branch * 2 is "left", branch * 2 + 1 is "right".
export const SIZE = 800;
const LEVELS = 6;

export function point(level: number, branch: number, levels = LEVELS) {
    const x = (level / levels) * SIZE;
    const y = ((branch + 0.5) / 2 ** level) * SIZE;
    return { x, y };
}

// A smooth curve from one branch to one of its two children on the next level
function curve(level: number, branch: number, child: number, levels = LEVELS) {
    const start = point(level, branch, levels);
    const end = point(level + 1, child, levels);
    const mid = (start.x + end.x) / 2;
    return `M${start.x},${start.y} C${mid},${start.y} ${mid},${end.y} ${end.x},${end.y}`;
}

// Every possible choice in the tree, drawn for the first drawn levels of a tree x levels deep
export function allChoices(levels = LEVELS, drawn = levels) {
    const paths: { level: number; d: string }[] = [];
    for (let level = 0; level < drawn; level++) {
        for (let branch = 0; branch < 2 ** level; branch++) {
            paths.push({ level, d: curve(level, branch, branch * 2, levels) });      // yes
            paths.push({ level, d: curve(level, branch, branch * 2 + 1, levels) });  // no
        }
    }
    return paths;
}

// The branch reached at each level by a list of picks (index 0 is the root)
export function branchesFor(picks: ("left" | "right")[]) {
    const branches = [0];
    for (const pick of picks) {
        branches.push(branches[branches.length - 1] * 2 + (pick === "left" ? 0 : 1));
    }
    return branches;
}

// One real life: the picks joined into one path
export function lifePath(picks: ("left" | "right")[]) {
    const branches = branchesFor(picks);
    let path = "";
    for (let level = 0; level < picks.length; level++) {
        path += curve(level, branches[level], branches[level + 1], picks.length);
    }
    return path;
}

// One random life: a yes/no pick at every level, joined into one path
export function randomLife() {
    let path = "";
    let branch = 0;
    for (let level = 0; level < LEVELS; level++) {
        const child = branch * 2 + (Math.random() < 0.5 ? 0 : 1);
        path += curve(level, branch, child);
        branch = child;
    }
    return path;
}
