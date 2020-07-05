// this vertex shader includes a varying vec2 vPosition
// the default PIXI vertex shader dont include it
// vPosition is a 2D projection of the current vertex.
// The default PIXI vertex shader dont integrate a vFilterCoord in local filter coordinates.
// This shader do it with function filterLocalCoord() and new varying vec2 vFilterCoord.

export const customVertex2D = `
precision mediump float;

attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform vec4 inputSize;
uniform vec4 outputFrame;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

vec2 filterLocalCoord( void )
{
    return filterTextureCoord() * inputSize.xy / outputFrame.zw;
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
    vFilterCoord = filterLocalCoord();
}
`;