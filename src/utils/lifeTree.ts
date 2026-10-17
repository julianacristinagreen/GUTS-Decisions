// Builds the SVG paths for the welcome-page decision tree.
// The tree fits in a SIZE x SIZE box: the root sits on the left, and each level splits every branch into yes/no.
export const SIZE = 600;
const LEVELS = 6;

function point(level: number, branch: number) {
    const x = (level / LEVELS) * SIZE;
    const y = ((branch + 0.5) / 2 ** level) * SIZE;
    return { x, y };
}

// A smooth curve from one branch to one of its two children on the next level
function curve(level: number, branch: number, child: number) {
    const start = point(level, branch);
    const end = point(level + 1, child);
    const mid = (start.x + end.x) / 2;
    return `M${start.x},${start.y} C${mid},${start.y} ${mid},${end.y} ${end.x},${end.y}`;
}

// Every possible choice in the tree
export function allChoices() {
    const paths: string[] = [];
    for (let level = 0; level < LEVELS; level++) {
        for (let branch = 0; branch < 2 ** level; branch++) {
            paths.push(curve(level, branch, branch * 2));      // yes
            paths.push(curve(level, branch, branch * 2 + 1));  // no
        }
    }
    return paths;
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
