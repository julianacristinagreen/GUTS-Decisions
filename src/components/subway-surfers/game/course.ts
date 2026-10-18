import { rngFor } from "../../../engine/rng";

export const LANE_X = 1.1;
export const COIN_COUNT = 30;
export const COIN_GAP = 10;
export const FIRST_COIN_Z = -40;

const OBSTACLE_GAP = 40;
const FIRST_OBSTACLE_Z = -70;
const OBSTACLE_COUNT = 7;

// A train is about 10 long. Coins this close in front of one are always put in the other lane
// so the player has room to switch lanes before they reach it
const BLOCKED_BEHIND = 1;
const BLOCKED_AHEAD = 20;

export interface Spot {
    x: number;
    z: number;
}

export interface Course {
    coins: Spot[];
    trains: Spot[];
    cones: Spot[];
}

const randomLaneX = (rng: () => number) => {
    if (rng() < 0.5) {
        return -LANE_X;
    }
    return LANE_X;
}

// Same seed and age always gives the same course
export const generateCourse = (seed: string, age: number): Course => {
    const rng = rngFor(`${seed}:chase`, age);
    const trains: Spot[] = [];
    const cones: Spot[] = [];

    for (let i = 0; i < OBSTACLE_COUNT; i++) {
        const spot = { x: randomLaneX(rng), z: FIRST_OBSTACLE_Z - OBSTACLE_GAP * i };
        if (rng() < 0.5) {
            trains.push(spot);
        }
        else {
            cones.push(spot);
        }
    }

    const obstacles = [...trains, ...cones];
    const coins: Spot[] = [];

    for (let i = 0; i < COIN_COUNT; i++) {
        const z = FIRST_COIN_Z - COIN_GAP * i;
        let x = randomLaneX(rng);

        for (const obstacle of obstacles) {
            const blocked = z <= obstacle.z + BLOCKED_AHEAD && z >= obstacle.z - BLOCKED_BEHIND;
            if (blocked && obstacle.x === x) {
                x = -x;
            }
        }

        coins.push({ x, z });
    }

    return { coins, trains, cones };
}
