export const xRay = `
precision mediump float;
precision mediump int;

uniform sampler2D uSampler;
uniform float time;
uniform float intensity;
uniform float divisor;
uniform int blend;
uniform vec2 dimensions;
uniform vec2 anchor;
uniform vec3 color;

varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

const float MU_TWOPI = 0.15915494309;
const float MU_PI5 = 1.59154943092;
const float MU_256 = 0.00390625;

vec4 blender(int blend, vec4 fColv4, vec4 sColv4)
{
    vec3 fCol = vec3(fColv4);
    vec3 sCol = vec3(sColv4);

    if ( blend <= 1) { fCol = fCol * sCol; }
    else if (blend == 2) { fCol = (1. - (1. - fCol) * (1. - sCol)); }
    else if (blend == 3) { fCol = min(fCol, sCol); }
    else if (blend == 4) { fCol = max(fCol, sCol); }
    else if (blend == 5) { fCol = abs(fCol - sCol); }
    else if (blend == 6) { fCol = 1. - abs(1. - fCol - sCol); }
    else if (blend == 7) { fCol = fCol + sCol - (2. * fCol * sCol); }
    else if (blend == 8) { fCol = all(lessThanEqual(fCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 9) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 10) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol + fCol * fCol * (1. - 2. * sCol)) : sqrt(fCol) * (2. * sCol - 1.) + (2. * fCol) * (1. - sCol); }
    else if (blend == 11) { fCol = fCol / (1.0 - sCol); }
    else if (blend == 12) { fCol = 1.0 - (1.0 - fCol) / sCol; }
    else if (blend == 13) { fCol = max(fCol,sCol)-(min(fCol,sCol)*0.5)+abs(fCol-sCol);}
    else if (blend >= 14) { fCol = fCol + sCol; }

    return vec4(fCol,fColv4.a);
}

void main() {

    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    vec2 uv = (vFilterCoord - anchor) / dimensions;

    float len = length(uv * 0.5);
   	float angle = atan(uv.x, uv.y) * MU_TWOPI;
    float beam = fract((angle) * divisor + sin((sqrt(len) * 0.2) - (time*0.5)));
    
    beam  = 2.* cos(beam * MU_PI5);
    beam *= floor(fract(angle * divisor + sin(time - (len * 1.2) * 0.2)) *256.) * MU_256;
    
    float fractburn = fract(beam);

    vec4 color1 = smoothstep(0.0, 1., (beam*(intensity*0.1) + pixel * vec4(color,1.)) / (fractburn == 0. ? fractburn+0.1 : fractburn) * 0.3 );
    vec4 result = blender(blend, pixel, color1);

    gl_FragColor = result*pixel.a;
}
`;
