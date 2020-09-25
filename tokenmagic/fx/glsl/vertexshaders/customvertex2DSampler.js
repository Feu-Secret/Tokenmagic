// Custom vertex shader with filter matrix to map for additionnal sampler

export const customVertex2DSampler = `
precision mediump float;

attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 targetUVMatrix;

varying vec2 vTextureCoord;
varying vec2 vTextureCoordExtra;
varying vec2 vFilterCoord;
varying vec4 vInputSize;
varying vec4 vOutputFrame;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
	gl_Position = filterVertexPosition();
	vTextureCoord = filterTextureCoord();
	vTextureCoordExtra = (targetUVMatrix * vec3(vTextureCoord, 1.0)).xy;
    vFilterCoord = vTextureCoord * inputSize.xy / outputFrame.zw;
    vInputSize = inputSize;
    vOutputFrame = outputFrame;
}
`;