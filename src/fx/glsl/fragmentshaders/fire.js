export const burnFire = `
precision mediump float;

uniform float time;
uniform float amplitude;
uniform float intensity;
uniform int fireBlend;
uniform int blend;
uniform bool alphaDiscard;
uniform vec2 anchor;
uniform vec3 color;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

float rand(vec2 n) 
{ 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
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

float noise(vec2 n) 
{
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n);
	vec2 f = smoothstep(vec2(0.), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), 
	       mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) 
{
	float total = 0.0, amp = amplitude;
	for (int i = 0; i < 7; i++) {
		total += noise(n) * amp;
		n += n;
		amp *= 0.5;
	}
	return total;
}

vec4 fire() 
{
    const vec3 c1 = vec3(0.1, 0.0, 0.);
	const vec3 c2 = vec3(0.7, 0.0, 0.);
	const vec3 c3 = vec3(0.2, 0.0, 0.);
	const vec3 c4 = vec3(1.0, 0.9, 0.);
	const vec3 c5 = vec3(0.1);
	const vec3 c6 = vec3(0.9);
    vec2 uv = vFilterCoord - anchor;
	vec2 p = uv.xy * 8.0;
	float q = fbm(p - time * 0.1);
	vec2 r = vec2(fbm(p + q + time * 0.7 - p.x - p.y), fbm(p + q - time * 0.4));
	vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
	return vec4(c * cos(1.57/(intensity-0.03) * uv.y), 1.0);
}

vec4 fireBlending()
{
    vec4 fire = fire();
    vec4 tint = vec4(color,1.0);
    return blenderVec3(fireBlend,fire,tint);
}

vec4 resultBlending(vec4 pixel, vec4 fire)
{
    vec4 result = blenderVec3(blend,pixel,fire);
    return result;
}

void main() 
{
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    vec4 result = resultBlending(pixel, fireBlending())*pixel.a;
    if (alphaDiscard && all(lessThanEqual(result.rgb,vec3(0.50)))) discard;
	gl_FragColor = result;
}
`;
