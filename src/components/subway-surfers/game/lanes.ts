const SIDE_SPEED = 0.1;
const HOP_HEIGHT = 0.6;
const GROUND_Y = -0.4;

// Moves a character sideways towards their lane and makes them hop on the way across
export function slideToLane(position: number[], targetX: number) {
    if (position[0] < targetX) {
        position[0] = Math.min(position[0] + SIDE_SPEED, targetX);
    }
    else if (position[0] > targetX) {
        position[0] = Math.max(position[0] - SIDE_SPEED, targetX);
    }

    // 0 in the left lane, 1 in the right lane, so the hop is highest in the middle
    const progress = (position[0] + 1) / 2;
    position[1] = GROUND_Y + HOP_HEIGHT * 4 * progress * (1 - progress);
}
