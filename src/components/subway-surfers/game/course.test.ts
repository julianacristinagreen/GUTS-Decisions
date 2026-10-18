import { describe, expect, it } from "vitest";
import { COIN_COUNT, generateCourse } from "./course";

describe("generateCourse", () => {
    it("gives the same course for the same seed and age", () => {
        expect(generateCourse("abc", 15)).toEqual(generateCourse("abc", 15));
    });

    it("has the right number of coins", () => {
        expect(generateCourse("abc", 15).coins.length).toBe(COIN_COUNT);
    });

    it("never puts a coin in the lane of a train or cones it is next to", () => {
        for (let n = 0; n < 200; n++) {
            const course = generateCourse(`seed${n}`, 15);
            const obstacles = [...course.trains, ...course.cones];

            for (const coin of course.coins) {
                for (const obstacle of obstacles) {
                    const close = coin.z <= obstacle.z + 20 && coin.z >= obstacle.z - 1;
                    expect(close && coin.x === obstacle.x).toBe(false);
                }
            }
        }
    });
});
