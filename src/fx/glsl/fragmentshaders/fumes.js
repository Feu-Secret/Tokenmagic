export const fumes = `
precision mediump float;
precision mediump int;

uniform float time;
uniform vec2 dimensions;
uniform int blend;
uniform vec3 color;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

#define TWOPI 6.28318530718

vec4 toGray(in vec4 color)
{
  float average = (color.r + color.g + color.b) * 0.33333334;
  return vec4(average, average, average, 1.0);
}

vec4 colorize(in vec4 grayscale, in vec4 color)
{
    return (grayscale * color);
}

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
    
    return vec4(fCol,1.0);
}

vec4 fog(vec2 fragCoord)
{
    float t = time * 0.26 + 23.0;
    vec2 uv = fragCoord.xy * dimensions.xy;

    vec2 p = mod(uv * TWOPI, TWOPI) - 250.0;
    vec2 i = vec2(p);
    float c = 0.75;
    float intensity = 0.014;

    for (int n = 0; n < 4; n++) {
        float t = t * (1.0 - (3.5 / float(n + 1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / length(vec2(.5 * p.x / (sin(0.40 * i.x + t) / intensity), p.y / (cos(i.y + t) / intensity)));
    }

    c *= 0.16666667;
    c = 1.17 - pow(c, 1.4);
    vec3 colour = vec3(pow(abs(c), 8.0));

    return vec4(colour * colour, 1.);
}


void main() 
{
    vec4 pixel = texture2D(uSampler,vTextureCoord);

    // to avoid computation on an invisible pixel.
    if (pixel.a==0.) {
        gl_FragColor = pixel;
        return;
    }

    // fog generation.
    vec4 fog = colorize(
               toGray(
                 fog(vFilterCoord.xy) 
               + fog(-vFilterCoord.xy * 0.65))
                    ,vec4(color/3., 1.)) * 0.9;

    // we put the fog and the pixel into the blender, and we serve, adjusted by the pixel alpha.
	gl_FragColor = blenderVec3(blend, fog, pixel) * pixel.a;
}
`;
