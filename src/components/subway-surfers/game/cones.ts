import { mat4 } from "gl-matrix";
import type { ColorBuffers, ProgramInfo } from "./types";

export default class Cones {
    buffers: ColorBuffers;
    position: number[];
    rotation: number;
    hit: boolean;

    constructor(gl: WebGLRenderingContext, posn: number[]) {
        this.position = posn;
        this.rotation = 0;
        this.hit = false;
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const positions: number[] = [];

        for(let i=0;i<360;i+=2){
            positions.push.apply(positions, [0.0, 0.7, 0.0,
                                            0.15*Math.cos(i*3.14/180.0), 0.0, 0.15*Math.sin(i*3.14/180.0),
                                            0.15*Math.cos((i+1)*3.14/180.0), 0.0, 0.15*Math.sin((i+1)*3.14/180.0),
                                            0.15*Math.cos((i+4)*3.14/180.0), 0.0, 0.15*Math.sin((i+2)*3.14/180.0),
                                            ]
                                );
        }
        for(let i=0;i<360;i+=2){
            positions.push.apply(positions, [0.3, 0.7, 0.0,
                                            0.3+0.15*Math.cos(i*3.14/180.0), 0.0, 0.15*Math.sin(i*3.14/180.0),
                                            0.3+0.15*Math.cos((i+1)*3.14/180.0), 0.0, 0.15*Math.sin((i+1)*3.14/180.0),
                                            0.3+0.15*Math.cos((i+4)*3.14/180.0), 0.0, 0.15*Math.sin((i+2)*3.14/180.0),
                                            ]
                                );
        }
        for(let i=0;i<360;i+=2){
            positions.push.apply(positions, [-0.3, 0.7, 0.0,
                                            -0.3+0.15*Math.cos(i*3.14/180.0), 0.0, 0.15*Math.sin(i*3.14/180.0),
                                            -0.3+0.15*Math.cos((i+1)*3.14/180.0), 0.0, 0.15*Math.sin((i+1)*3.14/180.0),
                                            -0.3+0.15*Math.cos((i+4)*3.14/180.0), 0.0, 0.15*Math.sin((i+2)*3.14/180.0),
                                            ]
                                );
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        const faceColors: number[][] = [];

        for(let i=0;i<3*180;i++){
            faceColors.push.apply(faceColors, [[1.0,  0.47,  0.0,  1.0],]);
        }
        let colors: number[] = [];

        for (let j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
            colors = colors.concat(c, c, c, c);
        }

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        const indices: number[] = [];

        for(let i=0;i<3*180;i++){
            indices.push.apply(indices, [4*i, 4*i+1, 4*i+2,     4*i, 4*i+2, 4*i+3,]);
        }

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffers = {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        };
    }

    draw(gl: WebGLRenderingContext, projectionMatrix: mat4, programInfo: ProgramInfo){

        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix,     // destination matrix
                modelViewMatrix,     // matrix to translate
                this.position);  // amount to translate

        {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
        }

        {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
        gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
        gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

        gl.useProgram(programInfo.program);

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const vertexCount = 3*180*6;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
}