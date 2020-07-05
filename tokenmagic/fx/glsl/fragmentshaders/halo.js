export const glowHalo = `
precision mediump float;

uniform sampler2D uSampler;
varying vec2 vUv;

void main( void ) {
    vec2 uv = vUv;
    // Zooms out by a factor of 2.0
    uv *= 2.0;
    // Shifts every axis by -1.0
    uv -= 1.0;

    // Base color for the effect
    vec3 color = vec3 ( .0, 0.8, .0 );

    // specify size of border. 0.0 - no border, 1.0 - border occupies the entire space
    vec2 borderSize = vec2(0.9); 

    // size of rectangle in terms of uv 
    vec2 rectangleSize = vec2(1.) - borderSize; 

    // distance field, 0.0 - point is inside rectangle, 1.0 point is on the far edge of the border.
    float distanceField = length(max(abs(uv)-rectangleSize,0.) / borderSize);

    // calculate alpha accordingly to the value of the distance field
    float alpha = 0.7 - distanceField;
    
    vec4 pixel = texture2D(uSampler, vUv);
    
    gl_FragColor = mix(pixel, vec4(color, alpha), 0.8); 
}
`;

export const projHalo = `
precision highp float;
precision highp int;

uniform sampler2D uSampler;
uniform vec2 resolution;
uniform float radius;
uniform vec3 color;
uniform float glow;
varying vec2 vUv;

void main() {
    vec2 uv = (vUv - 0.5) * resolution;
    float strength = dot(uv, uv);
    vec2 weight = vec2(radius * radius + radius * glow, radius * radius - radius * glow);
    float clamped = 1.0 - clamp(
        (strength - weight.y) / (weight.x - weight.y), 0.0, 1.0
    );

    vec4 pixel = texture2D(uSampler, vUv);
    vec4 effect = vec4(color * clamped, 1.0);
    //if (effect.rgb == vec3(0.,0.,0.)) {
    //    gl_FragColor = mix(pixel, effect, 0.);
    //} else {
    gl_FragColor = mix(pixel, effect * 3., pixel * effect.a);
    //}
}
`;

export const magicHalo = `
// Set the precision for data types used in this shader
precision highp float;
precision highp int;

// Default THREE.js uniforms available to both fragment and vertex shader
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;

uniform sampler2D uSampler;

// Default uniforms provided by ShaderFrog.
uniform vec3 cameraPosition;
uniform float time;

// A uniform unique to this shader. You can modify it to the using the form
// below the shader preview. Any uniform you add is automatically given a form
uniform vec3 color;
uniform vec3 lightPosition;

// Example varyings passed from the vertex shader
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vUv2;
//
//
//

#define resolution vec2(1.0)
#define RING_COUNT 0

const float falloffPower = 9.9;
float halfWidth = pow(0.10, falloffPower);
const float radius = 1.;
const vec2 noiseSampleDirection = vec2(0.5, 0.5);


float snoise(vec3 uv, float res)
{
    const vec3 s = vec3(1e0, 1e2, 1e3);
    uv *= res;
    vec3 uv0 = floor(mod(uv, res)) * s;
    vec3 uv1 = floor(mod(uv + 1., res)) * s;
    vec3 f = fract(uv);
    f = f * f * (3.0 - 2.0 * f);
    vec4 v = vec4(uv0.x + uv0.y + uv0.z, uv1.x + uv0.y + uv0.z,
        uv0.x + uv1.y + uv0.z, uv1.x + uv1.y + uv0.z);
    vec4 r = fract(sin(v * 1e-1) * 1e3);
    float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
    r = fract(sin((v + uv1.z - uv0.z) * 1e-1) * 1e3);
    float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
    return mix(r0, r1, f.z) * 2. - 1.;
}

vec3 burn(vec2 p, float size)
{
    float color1 = size * 4. - 3. * length(2.5 * p);
    vec3 coord = vec3(atan(p.x, p.y) / 6.2832 + .5, -length(p) * .4, 2.9);
    for (int i = 1; i <= 3; i++)
    {
        float power = exp2(float(i));
        color1 += 0.2 * (1.5 / power) * snoise(coord + vec3(0., -time * .05, -time * .01), power * 64.);
    }
    color1 *= cos(time) * 0.1 + 0.6;
    return vec3(1.0 - length(color1));
}

float waves(vec2 coord, vec2 coordMul1, vec2 coordMul2, vec2 phases, vec2 timeMuls) {
    return 0.5 * (sin(dot(coord, coordMul1) + timeMuls.x * time + phases.x) + cos(dot(coord, coordMul2) + timeMuls.y * time + phases.y));
}

float ringMultiplier(vec3 color, vec2 coord, float distortAmount, float phase, float baseXOffset) {
    vec2 sampleLocation1 = noiseSampleDirection * phase;
    vec2 sampleLocation2 = vec2(1.0, 0.8) - noiseSampleDirection * phase;
    vec3 noise1 = color / sampleLocation1.x * sampleLocation2.y;
    vec3 noise2 = color / sampleLocation2.x * sampleLocation1.y;

    float distortX = baseXOffset + 0.6 * waves(coord, vec2(1.9 + 0.4 * noise1.r, 1.9 + 0.4 * noise1.g) * 3.3, vec2(5.7 + 1.4 * noise1.b, 5.7 + 1.4 * noise2.r) * 2.8, vec2(noise1.r - noise2.r, noise1.g + noise2.b) * 5.0, vec2(1.1));
    float distortY = 0.5 + 0.7 * waves(coord, vec2(-1.7 - 0.9 * noise2.g, 1.7 + 0.9 * noise2.b) * 3.1, vec2(5.9 + 0.8 * noise1.g, -5.9 - 0.8 * noise1.b) * 3.7, vec2(noise1.g + noise2.g, noise1.b - noise2.r) * 5.0, vec2(-0.9));
    float amount = 0.2 + 0.3 * (abs(distortX) + abs(distortY));
    vec2 distortedCoord = coord + normalize(vec2(distortX, distortY)) * amount * distortAmount * 0.2;
    return smoothstep(-halfWidth, halfWidth, pow(abs(length(distortedCoord) - radius), falloffPower));
}

#define PI	3.14159265359
#define S(t) tan(t.x * 0.4 + 0.7)


float rand2(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 279.1414))) * 43758.5453);
}

float noise2(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand2(b), rand2(b + d.yx), f.x), mix(rand2(b + d.xy), rand2(b + d.yy), f.x), f.y);
}

void main()
{

    vec3 tint1 = vec3(sin(time) / 5.0, cos(time) / 5.0, 1.);
    vec2 R = resolution.xy;
    vec2 p = (vUv.xy - .5 * R) / R.y;

    float size = 0.5;
    vec3 color = burn(p, size);


    vec2 uv = vec2(0.5) - vUv.xy / resolution.xy;
    uv.x *= resolution.x / resolution.y;
    vec3 accumulatedColor = vec3(sin(time));
    float baseXOffset = 0.5 * (0.6 * cos(time * 0.3 + 1.1) + 0.4 * cos(time * 1.2));
    for (int i = 0; i < RING_COUNT; i++) {
        float ringsFraction = float(i) / float(RING_COUNT);
        float amount = ringMultiplier(color, uv, 0.1 + pow(ringsFraction, 0.5) * 0.7, pow(1.0 - ringsFraction, 0.3) * 0.09 + time * 0.0001, baseXOffset);
        accumulatedColor *= mix(mix(tint1, tint1 / 2.0, pow(ringsFraction, 3.0)), vec3(1.0), pow(amount, 2.0));
    }
    accumulatedColor = mix(color, accumulatedColor, tint1);


    vec4 fragColor4 = vec4(accumulatedColor, color);
    //fragColor4=mix(fragColor4, vec4(c3*0.5,0.5*c2,c3,1.0),c3);
    ///
    vec4 pixel = texture2D(uSampler, vUv);
    //vec4 pixelT = vec4(1.0,0.,0.,1.);
    //fragColor4 = mix(pixel*pixelT, fragColor4, pixel.a*fragColor4.a);
    if (pixel.a == 0.) {
        gl_FragColor = pixel;
    } else {
        gl_FragColor = mix(pixel, fragColor4, fragColor4.a * pixel * 2.0);
    }
}
`;