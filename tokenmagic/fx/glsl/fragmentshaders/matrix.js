export const matrix = `
precision mediump float;

uniform float rotation;
uniform vec2 scale;
uniform vec2 translation;
uniform vec2 pivot;
uniform vec4 filterClamp;
uniform sampler2D uSampler;

varying vec2 vFilterCoord;
varying vec4 vInputSize;
varying vec4 vOutputFrame;

float angle = radians(rotation);

void transform(out vec2 uv)
{
    uv -= pivot;
    uv *= mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
    uv *= mat2(scale.x,0.0,
                0.0,scale.y);
    uv += pivot;
}

void main() {
    vec2 uv = vFilterCoord + translation;
    transform(uv);
    vec2 mappedCoord = (uv*vOutputFrame.zw) / vInputSize.xy;
    vec4 pixel = texture2D(uSampler,clamp(mappedCoord, filterClamp.xy, filterClamp.zw));
    gl_FragColor = pixel;
}
`;