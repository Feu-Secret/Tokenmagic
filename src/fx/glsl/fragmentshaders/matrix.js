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
uniform vec4 inputClamp;
uniform sampler2D uSampler;
uniform mat3 filterMatrixInverse;

varying vec2 vFilterCoord;

const float PI = 3.1415927;

vec2 morphing(in vec2 uv) {
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

vec2 transform(in vec2 uv) {
    float angle = -(PI * rotation * 0.005555555555);
    uv -= pivot;
    uv *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    uv *= mat2(scale.x, 0.0, 0.0, scale.y);
    uv = morphing(uv);
    uv += pivot;

    return uv;
}

void main() {
    vec2 uv = vFilterCoord + translation;
    uv = transform(uv);
    vec2 mappedCoord = (filterMatrixInverse * vec3(uv, 1.0)).xy;
    vec4 pixel = texture2D(uSampler,clamp(mappedCoord, inputClamp.xy, inputClamp.zw));
    gl_FragColor = pixel;
}
`;
