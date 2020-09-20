export const matrix = `
precision mediump float;

uniform float rotation;
uniform float twRadius;
uniform float twAngle;
uniform float bpRadius;
uniform float bpStrength;
uniform vec2 scale;
uniform vec2 translation;
uniform vec2 pivot;
uniform vec4 filterClamp;
uniform sampler2D uSampler;

varying vec2 vFilterCoord;
varying vec4 vInputSize;
varying vec4 vOutputFrame;

float angle = -radians(rotation);

vec2 morphing(vec2 uv) {
    float dist = length(uv);

    // twist effect
    if (dist < twRadius) {
        float ratioDist = (twRadius - dist) / twRadius;
        float angleMod = ratioDist * ratioDist * twAngle;
        float s = sin(angleMod);
        float c = cos(angleMod);
        uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    }

    // bulge pinch effect
    if (dist < bpRadius) {
        float percent = dist / bpRadius;
        if (bpStrength > 0.) {
            uv *= mix(1.0, smoothstep(0., bpRadius / dist, percent), bpStrength * 0.75);
        } else {
            uv *= mix(1.0, pow(percent, 1.0 + bpStrength * 0.75) * bpRadius / dist, 1.0 - percent);
        }
    }

    return uv;
}

void transform(out vec2 uv) {
    uv -= pivot;
    uv *= mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
    uv *= mat2(scale.x,0.0,
                0.0,scale.y);
    uv = morphing(uv);
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