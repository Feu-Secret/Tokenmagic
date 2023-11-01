export const spritemask = `#version 300 es
precision mediump float;

uniform float rotation;
uniform float twRadius;
uniform float twAngle;
uniform float bpRadius;
uniform float bpStrength;
uniform float alpha;

uniform bool repeat;

uniform vec2 scale;
uniform vec2 translation;

uniform vec4 inputClamp;
uniform vec4 inputClampTarget;

uniform sampler2D uSampler;
uniform sampler2D uSamplerTarget;

in vec2 vTextureCoord;
in vec2 vTextureCoordExtra;
in vec2 vFilterCoord;
in mat3 vTargetUVMatrix;

out vec4 outputColor;

const float PI = 3.14159265358;

float getClip(in vec2 uv) {
    return step(3.5,
       step(inputClampTarget.x, uv.x) +
       step(inputClampTarget.y, uv.y) +
       step(uv.x, inputClampTarget.z) +
       step(uv.y, inputClampTarget.w));
}

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
    uv -= 0.5;
    uv *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    uv *= mat2(1.0 / scale.x, 0.0, 0.0, 1.0 / scale.y);
    uv = morphing(uv);
    uv += 0.5;

    return uv;
}

vec4 getFromColor(in vec2 uv) {
    return texture(uSampler, clamp(uv, inputClamp.xy, inputClamp.zw));
}

vec4 getToColor(in vec2 uv) {
    return texture(uSamplerTarget, clamp(uv, inputClampTarget.xy, inputClampTarget.zw)) * getClip(uv);
}

vec4 getToColorFract(in vec2 uv) {
    return textureGrad(uSamplerTarget, fract(uv), dFdx(uv), dFdy(uv));
}

void main() {

    // UV transformations
    vec2 uvTex = transform(vTextureCoordExtra);

    // get samplers color
    vec4 icolor = getFromColor(vTextureCoord);

    vec4 tcolor;
    if(repeat) tcolor = getToColorFract(uvTex + translation);
    else tcolor = getToColor(uvTex + translation);

    outputColor = icolor * (tcolor.a * alpha);
}
`;
