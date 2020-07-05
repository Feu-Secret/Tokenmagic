export const zapElectricity = `
precision mediump float;
precision mediump int;

#define INTENSITY 5

const float PI = 3.14159265358979323846264;

uniform sampler2D uSampler;
uniform vec4 color;
varying vec2 vFilterCoord;
varying vec2 vTextureCoord;
uniform float time;
uniform int blend;

float Perlin(vec3 P)
{
    vec3 Pi = floor(P);
    vec3 Pf = P - Pi;
    vec3 Pf_min1 = Pf - 1.0;

    Pi.xyz = Pi.xyz - floor(Pi.xyz * (1.0 / 69.0)) * 69.0;
    vec3 Pi_inc1 = step(Pi, vec3(69.0 - 1.5)) * (Pi + 1.0);

    vec4 Pt = vec4(Pi.xy, Pi_inc1.xy) + vec2(50.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    const vec3 SOMELARGEFLOATS = vec3(635.298681, 682.357502, 668.926525);
    const vec3 ZINC = vec3(48.500388, 65.294118, 63.934599);
    vec3 lowz_mod = vec3(1.0 / (SOMELARGEFLOATS + Pi.zzz * ZINC));
    vec3 highz_mod = vec3(1.0 / (SOMELARGEFLOATS + Pi_inc1.zzz * ZINC));
    vec4 hashx0 = fract(Pt * lowz_mod.xxxx);
    vec4 hashx1 = fract(Pt * highz_mod.xxxx);
    vec4 hashy0 = fract(Pt * lowz_mod.yyyy);
    vec4 hashy1 = fract(Pt * highz_mod.yyyy);
    vec4 hashz0 = fract(Pt * lowz_mod.zzzz);
    vec4 hashz1 = fract(Pt * highz_mod.zzzz);

    vec4 grad_x0 = hashx0 - 0.49999;
    vec4 grad_y0 = hashy0 - 0.49999;
    vec4 grad_z0 = hashz0 - 0.49999;
    vec4 grad_x1 = hashx1 - 0.49999;
    vec4 grad_y1 = hashy1 - 0.49999;
    vec4 grad_z1 = hashz1 - 0.49999;
    vec4 grad_results_0 = inversesqrt(grad_x0 * grad_x0 + grad_y0 * grad_y0 + grad_z0 * grad_z0) * (vec2(Pf.x, Pf_min1.x).xyxy * grad_x0 + vec2(Pf.y, Pf_min1.y).xxyy * grad_y0 + Pf.zzzz * grad_z0);
    vec4 grad_results_1 = inversesqrt(grad_x1 * grad_x1 + grad_y1 * grad_y1 + grad_z1 * grad_z1) * (vec2(Pf.x, Pf_min1.x).xyxy * grad_x1 + vec2(Pf.y, Pf_min1.y).xxyy * grad_y1 + Pf_min1.zzzz * grad_z1);

    vec3 blend = Pf * Pf * Pf * (Pf * (Pf * 6.0 - 15.0) + 10.0);
    vec4 res0 = mix(grad_results_0, grad_results_1, blend.z);
    vec4 blend2 = vec4(blend.xy, vec2(1.0 - blend.xy));
    float final = dot(res0, blend2.zxzx * blend2.wwyy);
    return (final * 1.1547005383792515290182975610039);  // scale things to a strict -1.0->1.0 range  *= 1.0/sqrt(0.75)
}

float fbm(vec3 p)
{
    float v = 0.0;
    v += Perlin(p * 0.9) * 1.5 * cos(1.2 * PI * (time / 2.5));
    v += Perlin(p * 3.99) * 0.5 * sin(PI * time / 2.5);
    v += Perlin(p * 8.01) * 0.4 * cos(PI * time / 2.5);
    v += Perlin(p * 15.05) * 0.05 * sin(0.1 * PI * time * 8.);

    return v;
}

vec4 electric() {
    vec3 noiseVec = vec3(vFilterCoord, 1.);
    vec3 color = vec3(0.0);
    for (int i = 0; i < INTENSITY; ++i ) {
        noiseVec = noiseVec.yxz;
        float t = abs(2.0 / (fbm(noiseVec + vec3(0.0, time / float(i + 4), 0.0)) * 120.0));
        color += t * vec3(float(i + 1) * 0.1 + 0.1, 0.5, 2.0);
    }
    return vec4(color, 1.);
}

void main() {
 
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    vec4 electric = electric();

    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }
    
    electric *= color;

    vec4 result;

    if (blend == 1) { result = pixel * electric; }
    else if (blend == 2) { result = (1. - (1. - pixel) * (1. - electric)); }
    else if (blend == 3) { result = min(pixel, electric); }
    else if (blend == 4) { result = max(pixel, electric); }
    else if (blend == 5) { result = abs(pixel - electric); }
    else if (blend == 6) { result = 1. - abs(1. - pixel - electric); }
    else if (blend == 7) { result = pixel + electric - (2. * pixel * electric); }
    else if (blend == 8) { result = all(lessThanEqual(pixel,vec4(0.5,0.5,0.5,1.))) ? (2. * pixel * electric) : (1. - 2. * (1. - pixel) * (1. - electric)); }
    else if (blend == 9) { result = all(lessThanEqual(electric,vec4(0.5,0.5,0.5,1.))) ? (2. * pixel * electric) : (1. - 2. * (1. - pixel) * (1. - electric)); }
    else if (blend == 10) { result = all(lessThanEqual(electric,vec4(0.5,0.5,0.5,1.))) ? (2. * pixel * electric + pixel * pixel * (1. - 2. * electric)) : sqrt(pixel) * (2.*electric-1.) + (2.*pixel) * (1.-electric); }
    else if (blend == 11) { result = pixel/(1.0-electric); } 
    else if (blend == 12) { result = 1.0 - (1.0 - pixel) / electric; } 
    else { result = pixel; }

    result*=pixel.a;
    gl_FragColor = result;
}
`;


