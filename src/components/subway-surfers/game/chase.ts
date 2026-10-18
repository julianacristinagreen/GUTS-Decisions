import { mat4 } from "gl-matrix";
import Bg from "./bg";
import Coin from "./coin";
import Cones from "./cones";
import Ground from "./ground";
import Police from "./police";
import Sun from "./sun";
import Surfer from "./surfer";
import Track from "./track";
import Train from "./train";
import Wall from "./wall";
import { COIN_COUNT, COIN_GAP, FIRST_COIN_Z, generateCourse } from "./course";
import { loadTexture, makeColorProgram, makeTextureProgram } from "./shaders";
import type { ProgramInfo } from "./types";
import blueUrl from "../assets/blue.jpg";
import goldUrl from "../assets/gold.jpg";
import groundUrl from "../assets/ground.jpg";
import redUrl from "../assets/red.jpeg";
import skyUrl from "../assets/sky.jpg";
import tracksUrl from "../assets/tracks.jpg";
import trainUrl from "../assets/train.jpg";
import wallUrl from "../assets/wall.jpg";

export type ChaseResult = "escaped" | "caught";

// The game updates 60 times a second no matter how fast the screen refreshes
const TICK_MS = 1000 / 60;
const START_GAP = 5;
const MAX_GAP = 5;
const CAUGHT_GAP = 1.5;
const END_OF_ROAD_Z = FIRST_COIN_Z - COIN_GAP * COIN_COUNT;

export default class ChaseGame {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    colorProgram: ProgramInfo;
    textureProgram: ProgramInfo;
    goal: number;
    onScore: (score: number) => void;
    onFinish: (result: ChaseResult) => void;

    bg: Bg;
    ground: Ground;
    sun: Sun;
    walls: Wall[];
    tracks: Track[];
    surfer: Surfer;
    police: Police;
    coins: Coin[];
    trains: Train[];
    cones: Cones[];

    blueTexture: WebGLTexture;
    goldTexture: WebGLTexture;
    groundTexture: WebGLTexture;
    redTexture: WebGLTexture;
    skyTexture: WebGLTexture;
    tracksTexture: WebGLTexture;
    trainTexture: WebGLTexture;
    wallTexture: WebGLTexture;

    score: number;
    running: boolean;
    stopped: boolean;
    frameId: number;
    lastTime: number;
    leftover: number;

    constructor(
        canvas: HTMLCanvasElement,
        seed: string,
        age: number,
        goal: number,
        onScore: (score: number) => void,
        onFinish: (result: ChaseResult) => void
    ) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl")!;
        this.goal = goal;
        this.onScore = onScore;
        this.onFinish = onFinish;

        this.colorProgram = makeColorProgram(this.gl);
        this.textureProgram = makeTextureProgram(this.gl);

        this.blueTexture = loadTexture(this.gl, blueUrl);
        this.goldTexture = loadTexture(this.gl, goldUrl);
        this.groundTexture = loadTexture(this.gl, groundUrl);
        this.redTexture = loadTexture(this.gl, redUrl);
        this.skyTexture = loadTexture(this.gl, skyUrl);
        this.tracksTexture = loadTexture(this.gl, tracksUrl);
        this.trainTexture = loadTexture(this.gl, trainUrl);
        this.wallTexture = loadTexture(this.gl, wallUrl);

        this.bg = new Bg(this.gl);
        this.ground = new Ground(this.gl);
        this.sun = new Sun(this.gl);
        this.walls = [new Wall(this.gl, [-3.0, 0.0, 0.0]), new Wall(this.gl, [3.0, 0.0, 0.0])];
        this.tracks = [new Track(this.gl, [-1.1, 0.0, 0.0]), new Track(this.gl, [1.1, 0.0, 0.0])];
        this.surfer = new Surfer(this.gl, [-1.0, -0.4, -8.0]);
        this.police = new Police(this.gl, [-1.0, -0.4, -8.0 + START_GAP]);

        const course = generateCourse(seed, age);
        this.coins = course.coins.map(spot => new Coin(this.gl, [spot.x, -0.2, spot.z]));
        this.trains = course.trains.map(spot => new Train(this.gl, [spot.x, -0.7, spot.z]));
        this.cones = course.cones.map(spot => new Cones(this.gl, [spot.x, -0.7, spot.z]));

        this.score = 0;
        this.running = false;
        this.stopped = false;
        this.lastTime = performance.now();
        this.leftover = 0;
        this.frameId = requestAnimationFrame(now => this.frame(now));
    }

    // Everything is drawn from the start but nothing moves until this is called
    start() {
        this.running = true;
    }

    stop() {
        this.stopped = true;
        cancelAnimationFrame(this.frameId);
    }

    moveLeft() {
        if (this.running) {
            this.surfer.moveLeft();
        }
    }

    moveRight() {
        if (this.running) {
            this.surfer.moveRight();
        }
    }

    frame(now: number) {
        if (this.stopped) {
            return;
        }
        this.frameId = requestAnimationFrame(next => this.frame(next));

        // Cap it so the game doesn't rush to catch up after the tab was hidden
        this.leftover += Math.min(now - this.lastTime, 100);
        this.lastTime = now;

        while (this.leftover >= TICK_MS) {
            if (this.running) {
                this.tick();
            }
            this.leftover -= TICK_MS;
        }

        this.draw();
    }

    finish(result: ChaseResult) {
        this.running = false;
        this.onFinish(result);
    }

    tick() {
        this.surfer.tick();
        this.police.tick(this.surfer.position[0]);

        // The police can only fall so far behind
        const maxPoliceZ = this.surfer.position[2] + MAX_GAP;
        if (this.police.position[2] > maxPoliceZ) {
            this.police.position[2] = maxPoliceZ;
        }

        const gap = this.police.position[2] - this.surfer.position[2];
        if (gap < CAUGHT_GAP) {
            this.finish("caught");
            return;
        }

        for (const coin of this.coins) {
            if (coin.taken) {
                continue;
            }
            coin.tick();

            const dx = coin.position[0] - this.surfer.position[0];
            const dy = coin.position[1] - this.surfer.position[1];
            const dz = coin.position[2] - this.surfer.position[2];
            if (dx * dx + dy * dy + dz * dz < 0.3) {
                coin.taken = true;
                this.score++;
                this.onScore(this.score);

                if (this.score >= this.goal) {
                    this.finish("escaped");
                    return;
                }
            }
        }

        // A train fills the whole lane, so jumping over it doesn't help
        for (const train of this.trains) {
            const behindFront = this.surfer.position[2] < train.position[2] + 10;
            const inFrontOfBack = this.surfer.position[2] > train.position[2] + 0.8;
            const sameLane = Math.abs(this.surfer.position[0] - train.position[0]) < 1.2;
            if (behindFront && inFrontOfBack && sameLane) {
                this.finish("caught");
                return;
            }
        }

        // The cones only slow you down, which lets the police catch up
        for (const cone of this.cones) {
            const dz = Math.abs(cone.position[2] - this.surfer.position[2]);
            const dx = Math.abs(cone.position[0] + 0.15 - this.surfer.position[0]);
            if (!cone.hit && dz < 0.5 && dx < 0.6) {
                cone.hit = true;
                this.surfer.slowDown();
            }
        }

        // Ran out of road without enough coins
        if (this.surfer.position[2] < END_OF_ROAD_Z) {
            this.finish("caught");
        }
    }

    draw() {
        const gl = this.gl;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, 60 * Math.PI / 180, this.canvas.width / this.canvas.height, 0.1, 10000.0);

        // The camera sits behind the surfer and follows them
        const surferPos = this.surfer.position;
        const cameraPos = [surferPos[0], Math.max(surferPos[1] + 1.5, 1.3), surferPos[2] + 8.5];
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, cameraPos, [cameraPos[0], cameraPos[1], cameraPos[2] - 2.0], [0, 1, 0]);
        const viewProjectionMatrix = mat4.create();
        mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

        const color = this.colorProgram;
        const picture = this.textureProgram;

        this.ground.draw(gl, viewProjectionMatrix, picture, 1, this.groundTexture);
        for (const wall of this.walls) {
            wall.draw(gl, viewProjectionMatrix, picture, 1, this.wallTexture);
        }
        for (const track of this.tracks) {
            track.draw(gl, viewProjectionMatrix, picture, 1, this.tracksTexture);
        }
        this.bg.draw(gl, viewProjectionMatrix, picture, 1, this.skyTexture);
        this.surfer.draw(gl, viewProjectionMatrix, picture, 1, this.redTexture);
        this.police.draw(gl, viewProjectionMatrix, picture, 1, this.blueTexture);

        this.sun.draw(gl, viewProjectionMatrix, color);

        for (const coin of this.coins) {
            if (!coin.taken) {
                coin.draw(gl, viewProjectionMatrix, picture, 1, this.goldTexture);
            }
        }
        for (const train of this.trains) {
            train.draw(gl, viewProjectionMatrix, picture, 1, this.trainTexture);
        }
        for (const cone of this.cones) {
            cone.draw(gl, viewProjectionMatrix, color);
        }
    }
}
