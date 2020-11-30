export const sprite = `
precision mediump float;

uniform float rotation;
uniform float twRadius;
uniform float twAngle;
uniform float bpRadius;
uniform float bpStrength;

uniform bool inverse;
uniform bool top;
uniform bool colorize;

uniform vec2 scale;
uniform vec2 translation;

uniform vec3 color;

uniform vec4 filterClamp;
uniform vec4 filterClampTarget;

uniform sampler2D uSampler;
uniform sampler2D uSamplerTarget;

varying vec4 vInputSize;
varying vec4 vOutputFrame;
varying vec2 vTextureCoord;
varying vec2 vTextureCoordExtra;
varying vec2 vFilterCoord;
varying mat3 vTargetUVMatrix;

const float PI = 3.14159265358;

float getClip(in vec2 uv) {
    return step(3.5,
       step(filterClampTarget.x, uv.x) +
       step(filterClampTarget.y, uv.y) +
       step(uv.x, filterClampTarget.z) +
       step(uv.y, filterClampTarget.w));
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

vec4 colorization(in vec4 col) {
    vec3 wcol = col.rgb;
    if (inverse) {
        wcol = (vec3(1.0) - wcol) * col.a;
    }
    float avg = (wcol.r + wcol.g + wcol.b) / 3.0;
    return vec4(vec3(color * avg), col.a);
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
    return texture2D(uSampler, clamp(uv, filterClamp.xy, filterClamp.zw));
}

vec4 getToColor(in vec2 uv) {
    return texture2D(uSamplerTarget, clamp(uv, filterClampTarget.xy, filterClampTarget.zw)) * getClip(uv);
}

void main() {

    vec4 fcolor;

    // UV transformations
    vec2 uvTex = transform(vTextureCoordExtra);

    // get samplers color
    vec4 tcolor = getToColor(uvTex + translation);
    vec4 icolor = getFromColor(vTextureCoord);

    // colorize if necessary
    if (colorize) {
        tcolor = colorization(tcolor);
    }

    if (top) fcolor = mix(tcolor, icolor, 1.0 - tcolor.a);
    else fcolor = mix(icolor, tcolor, 1.0 - icolor.a);
   
    gl_FragColor = fcolor;
}
`;