export const splash = `
precision mediump float;

uniform float time;
uniform float seed;
uniform float spread;
uniform float splashFactor;
uniform int blend;
uniform vec2 dimensions;
uniform vec2 anchor;
uniform vec3 color;
uniform bool cut;
uniform bool textureAlphaBlend;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

float random(vec2 n) 
{ 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
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

vec3 splash(vec2 g)
{
	vec2 uv = (12.*(2.*g-1.)*.2) / dimensions;

    float a = abs(atan(uv.x,uv.y) * splashFactor);   
	vec3 iuv = vec3(uv.x,uv.y,a);

	float cseed = sin(1.+fract(abs(random(vec2(seed*0.9854,seed*0.3541)))));
    vec3 uvw = iuv;

	iuv = 1. - abs(1. - mod(uvw - time*0.1, 2.));
	
    float initLen = length(iuv);
    float nLen = initLen;
    float tot = 0.;
    
    for (int i=0; i < 12; i++) 
	{
		iuv = abs(iuv) / (initLen*initLen) - cseed;
		nLen = length(iuv);
		tot += abs(nLen-initLen);
		initLen = nLen;
    }
    
    float fc = tot + 1.0;
	fc = 1.-smoothstep(fc, fc+1.9, spread/dot(uv,uv));
	
	return vec3(1.-fc)*color;
}

void main() {
    vec4 pixel = texture2D(uSampler,vTextureCoord);
    vec3 splashed = splash(vFilterCoord - anchor);

    if (splashed == vec3(0.0))
    {
        if (pixel.a > 0. && !cut)
        {
            gl_FragColor = pixel;
            return;
        }
        else if (cut) discard;
    }

    vec4 splashed4 = vec4(splashed,1.);
    vec4 blendResult = mix(blender(blend, pixel, splashed4),splashed4,1.-pixel.a);
    gl_FragColor = (textureAlphaBlend ? blendResult * pixel.a : blendResult);
}
`;
