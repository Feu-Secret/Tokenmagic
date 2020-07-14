export const mirrorImages = `
precision mediump float;

uniform float time;
uniform float alpha;
uniform int blend;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float PI = 3.14159265;
const vec2 resolution = vec2(1.0,1.0);

vec4 blenderVec3(int blend, vec4 fColv4, vec4 sColv4)
{
    vec3 fCol = vec3(fColv4);
    vec3 sCol = vec3(sColv4);
    if ( blend == 1) { fCol = fCol * sCol; }
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
    else if (blend == 13) { fCol = fCol + sCol; }
    else { fCol = fCol + sCol; }
    
    return vec4(fCol,max(fColv4.a,sColv4.a));
}

void main() 
{
    float x = 0.05*cos(time);
    float y = 0.05*sin(time);

    vec2 translator1 = vec2(x,y);
    vec2 translator2 = 0.95*vec2(-x,y*0.5);
    vec2 translator3 = 0.75*vec2(x,-y);
    vec2 translator4 = 0.90*vec2(-x*0.5,-y);
    
    vec2 vUv = vTextureCoord;
    vec2 uvImg1 = vUv + translator1;
    vec2 uvImg2 = vUv + translator2;
    vec2 uvImg3 = vUv + translator3;
    vec2 uvImg4 = vUv + translator4;

    vec4 mirror1 = texture2D(uSampler, uvImg1);
    vec4 mirror2 = texture2D(uSampler, uvImg2);
    vec4 mirror3 = texture2D(uSampler, uvImg3);
    vec4 mirror4 = texture2D(uSampler, uvImg4);

    gl_FragColor = blenderVec3(blend, blenderVec3(blend, blenderVec3(blend, mirror1,mirror2),mirror3),mirror4)*alpha;
}
`;