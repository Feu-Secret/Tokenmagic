export const liquid = `
precision mediump float;
precision mediump int;

uniform sampler2D uSampler;
uniform mat3 filterMatrixInverse;
uniform float time;
uniform float intensity;
uniform float scale;
uniform int blend;
uniform bool spectral;
uniform bool alphaDiscard;
uniform vec3 color;

varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

#define PI 3.14159265359

#define NUM_OCTAVES 3

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

vec4 blenderVec3(int blend, vec4 fColv4, vec3 sCol)
{
    vec3 fCol = vec3(fColv4);
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
    else if (blend == 11) { fCol = fCol / (1.0 - sCol + 0.00001); }
    else if (blend == 12) { fCol = 1.0 - (1.0 - fCol) / sCol + 0.00001; }
    else if (blend == 13) { fCol = max(fCol,sCol)-(min(fCol,sCol)*0.5)+abs(fCol-sCol);}
    else if (blend >= 14) { fCol = fCol + sCol; }
    
    return vec4(fCol,fColv4.a);
}

void main() {
    
    float distortion1 = fbm( 
        vec2( fbm(  vFilterCoord * 2.5 * scale + time*0.5),
              fbm( (-vFilterCoord - vec2(0.01)) * 5. * scale + time*0.3333334) )
                    );
    
    float distortion2 = fbm( 
        vec2( fbm( -vFilterCoord * 5. * scale + time*0.5),
              fbm(  (vFilterCoord + vec2(0.01)) * 2.5 * scale + time*0.3333334) )
                    );
    
    vec2 uv = vFilterCoord;
    
    uv.x += 0.8*sin(min(distortion1*0.25,distortion2*0.25));
    uv.y += 0.8*cos(min(distortion1*0.25,distortion2*0.25));
    uv *= 1. + 0.11*(cos(sqrt(max(distortion1, distortion2))+1.)*0.5);
    uv -= vec2(0.036,0.81); 

    vec2 mappedCoord = (filterMatrixInverse * vec3(uv, 1.0)).xy;
    
    vec4 pixel = texture2D(uSampler, mappedCoord);
    vec3 aColor = color;
    if (alphaDiscard) aColor.rgb *= mix(distortion1,distortion2,0.5);
    else aColor.rgb *= min(distortion1,distortion2);
    pixel.rgb += aColor*intensity;

    float a = pixel.a;

    if (spectral) pixel.a = max(distortion1,distortion2)*3.75;
    if (alphaDiscard && all(lessThanEqual(pixel.rgb,vec3(0.50)))) discard;

    gl_FragColor = blenderVec3(blend,pixel,color*0.3333334) * min(pixel.a,a);
}
`;
