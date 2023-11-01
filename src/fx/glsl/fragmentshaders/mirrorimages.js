export const mirrorImages = `
precision mediump float;

uniform float time;
uniform float alphaImg;
uniform float alphaChr;
uniform float ampX;
uniform float ampY;
uniform int blend;
uniform int nbImage;
uniform sampler2D uSampler;
uniform vec4 inputClamp;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float PI = 3.14159265;

float bornedCos(float mi, float ma) {
    return (ma-mi)*(cos(2.*PI*time*0.2+1.)*0.5)+mi;
}

float bornedSin(float mi, float ma) {
    return (ma-mi)*(sin(2.*PI*time*0.2+1.)*0.5)+mi;
}

vec4 blender(int blend, vec4 fCol, vec4 sCol)
{
    if ( blend == 1) { fCol.rgb = fCol.rgb * sCol.rgb; }
    else if (blend == 2) { fCol.rgb = (1. - (1. - fCol.rgb) * (1. - sCol.rgb)); }
    else if (blend == 3) { fCol.rgb = min(fCol.rgb, sCol.rgb); }
    else if (blend == 4) { fCol.rgb = max(fCol.rgb, sCol.rgb); }
    else if (blend == 5) { fCol.rgb = abs(fCol.rgb - sCol.rgb); }
    else if (blend == 6) { fCol.rgb = 1. - abs(1. - fCol.rgb - sCol.rgb); }
    else if (blend == 7) { fCol.rgb = fCol.rgb + sCol.rgb - (2. * fCol.rgb * sCol.rgb); }
    else if (blend == 8) { fCol.rgb = all(lessThanEqual(fCol.rgb, vec3(0.5, 0.5, 0.5))) ? (2. * fCol.rgb * sCol.rgb) : (1. - 2. * (1. - fCol.rgb) * (1. - sCol.rgb)); }
    else if (blend == 9) { fCol.rgb = all(lessThanEqual(sCol.rgb, vec3(0.5, 0.5, 0.5))) ? (2. * fCol.rgb * sCol.rgb) : (1. - 2. * (1. - fCol.rgb) * (1. - sCol.rgb)); }
    else if (blend == 10) { fCol.rgb = all(lessThanEqual(sCol.rgb, vec3(0.5, 0.5, 0.5))) ? (2. * fCol.rgb * sCol.rgb + fCol.rgb * fCol.rgb * (1. - 2. * sCol.rgb)) : sqrt(fCol.rgb) * (2. * sCol.rgb - 1.) + (2. * fCol.rgb) * (1. - sCol.rgb); }
    else if (blend == 11) { fCol.rgb = fCol.rgb / (1.0 - sCol.rgb); }
    else if (blend == 12) { fCol.rgb = 1.0 - (1.0 - fCol.rgb) / (sCol.rgb)+0.001; }
    else if (blend == 13) { fCol.rgb = fCol.rgb + sCol.rgb; }
    else if (blend == 14) { fCol.rgb = (max(fCol.rgb,sCol.rgb)-(min(fCol.rgb,sCol.rgb)))+abs(fCol.rgb-sCol.rgb);}
    else { fCol.rgb = clamp(fCol.rgb + sCol.rgb,0.,1.); }

    fCol.a = max(fCol.a,sCol.a);
    return fCol;
}

vec4 renderMirror(vec2 translation, vec4 prevpix)
{
    vec2 displaced = vTextureCoord + translation;
    return blender(blend, prevpix, 
                   texture2D(uSampler, clamp(displaced, inputClamp.xy, inputClamp.zw)));
}

void main() 
{
    float x = ampX * bornedCos(0.,1.);
    float y = ampY * bornedSin(0.,1.);
    vec4 renderedPixel;
    vec2 translation;

    if (nbImage >= 1) {
        translation = vec2(x,y);
        renderedPixel = texture2D(uSampler, clamp(vTextureCoord + translation, inputClamp.xy, inputClamp.zw));
    }
    if (nbImage >= 2) {
        translation = 0.90*vec2(-x,y*0.5);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 3) {
        translation = 0.70*vec2(x,-y);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 4) {
        translation = 0.80*vec2(-x*0.6,-y);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 5) {
        translation = 1.20*vec2(-x,y*0.4);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 6) {
        translation = 1.10*vec2(x,-y);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 7) {
        translation = 0.6*vec2(-x*0.4,-y);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 8) {
        translation = 1.3*vec2(-x,y*0.70);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 9) {
        translation = vec2(x*0.5,y*0.85);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    renderedPixel = renderedPixel*alphaImg;
    gl_FragColor = blender(blend,texture2D(uSampler, vTextureCoord)*alphaChr , renderedPixel);
}
`;
