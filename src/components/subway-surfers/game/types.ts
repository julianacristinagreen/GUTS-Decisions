export interface Buffers {
    position: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
    textureCoord: WebGLBuffer;
}

export interface ColorBuffers {
    position: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
}

export interface ProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: number;
        vertexColor: number;
        textureCoord: number;
    };
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null;
        modelViewMatrix: WebGLUniformLocation | null;
        uSampler: WebGLUniformLocation | null;
    };
}
