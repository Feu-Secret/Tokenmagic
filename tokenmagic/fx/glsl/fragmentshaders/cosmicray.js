export const cosmicRayFrag = `
precision mediump float;
precision mediump int;

uniform sampler2D uSampler;
uniform float time;
uniform vec2 dimensions;
uniform vec2 anchor;
uniform vec4 color;
uniform float divisor;
uniform bool alphaDiscard;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

float PI = 3.14159265359;
float speed = 1.2;
float width = 0.5;
float subdivide = 512.0;

void main() {

    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    vec2 uv = (vFilterCoord - anchor) / dimensions;    
    float len = length(uv *0.5),
   		angle = ( atan(uv.x, uv.y) / ( 2. * PI) ) + 1.5,
    	wobble = 48. + 24. * cos(time/5.),
    	white = fract((angle) * divisor + sin((sqrt(len) * wobble) - time * speed));
    
    white  = 2.* cos(white / (PI * 0.1));
    white *= floor(fract(angle * divisor + sin(time / speed - (len * 1.2) * wobble)) *subdivide) / subdivide;
    
    vec4 color1 = smoothstep(0., 1., white * color);
    vec4 result = mix(pixel, color1, color1.a);
    if (alphaDiscard && all(lessThanEqual(result.rgb,vec3(0.05)))) discard;
    gl_FragColor = result*pixel.a;
}
`;
