import type { ProgramInfo } from "./types";

const colorVertex = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

const colorFragment = `
    varying lowp vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
`;

const textureVertex = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
`;

const textureFragment = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`;

const loadShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

const makeProgram = (gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) => {
    const program = gl.createProgram()!;
    gl.attachShader(program, loadShader(gl, gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    return program;
}

// For the things that only have a colour (the cones and the sun)
export const makeColorProgram = (gl: WebGLRenderingContext): ProgramInfo => {
    const program = makeProgram(gl, colorVertex, colorFragment);
    return {
        program: program,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(program, "aVertexColor"),
            textureCoord: -1,
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(program, "uModelViewMatrix"),
            uSampler: null,
        },
    };
}

// For everything that is covered in a picture
export const makeTextureProgram = (gl: WebGLRenderingContext): ProgramInfo => {
    const program = makeProgram(gl, textureVertex, textureFragment);
    return {
        program: program,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
            vertexColor: -1,
            textureCoord: gl.getAttribLocation(program, "aTextureCoord"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(program, "uModelViewMatrix"),
            uSampler: gl.getUniformLocation(program, "uSampler"),
        },
    };
}

const isPowerOf2 = (value: number) => (value & (value - 1)) === 0;

// Starts as a blue pixel and swaps to the picture once it has loaded
export const loadTexture = (gl: WebGLRenderingContext, url: string) => {
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;
    return texture;
}
