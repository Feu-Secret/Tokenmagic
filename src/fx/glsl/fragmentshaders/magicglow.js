export const magicGlow = `
precision mediump float;

uniform sampler2D uSampler;
uniform float time;
uniform float scale;
uniform float auraIntensity;
uniform float subAuraIntensity;
uniform float threshold;
uniform int auraType;
uniform bool holes;
uniform vec2 thickness;
uniform vec4 color;
uniform vec4 inputSize;
uniform vec4 inputClamp;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const int NUM_OCTAVES = 4;
const float PI = 3.14159265358;
const float TWOPI = 6.28318530717;
const float MAX_TOTAL_ALPHA = 17.2787595915;

float rand(vec2 uv)
{
    return fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p)
{
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) 
{
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

vec4 outlining() 
{
    vec4 ownColor = texture2D(uSampler, vTextureCoord);
    vec4 curColor;
    float maxAlpha = 0.;
    vec2 displaced;
    for (float angle = 0.; angle <= TWOPI; angle += 0.3141592653) {
        displaced.x = vTextureCoord.x + thickness.x * cos(angle);
        displaced.y = vTextureCoord.y + thickness.y * sin(angle);
        curColor = texture2D(uSampler, clamp(displaced, inputClamp.xy, inputClamp.zw));
        maxAlpha = max(maxAlpha, curColor.a);
    }
    float resultAlpha = max(maxAlpha, ownColor.a);
    return vec4((ownColor.rgb + color.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);

}

vec4 glowing() 
{
	vec2 px = inputSize.zw;

    float totalAlpha = 0.0;
    float outerStrength = 6.;

    vec2 direction;
    vec2 displaced;
    vec4 curColor;

    for (float angle = 0.0; angle < TWOPI; angle += 0.3141592653) {
       direction = vec2(cos(angle), sin(angle)) * px;

       for (float curDistance = 0.0; curDistance < 10.; curDistance++) {
           displaced = clamp(vTextureCoord + direction * 
                   (curDistance + 1.0), inputClamp.xy, inputClamp.zw);

           curColor = texture2D(uSampler, displaced);
           totalAlpha += (10. - curDistance) * curColor.a;
       }
    }
    
    curColor = texture2D(uSampler, vTextureCoord);

    float alphaRatio = (totalAlpha / MAX_TOTAL_ALPHA);
    float outerGlowAlpha = alphaRatio * outerStrength * (1. - curColor.a);
    float outerGlowStrength = min(1.0 - curColor.a, outerGlowAlpha);

    vec4 outerGlowColor = (outerGlowStrength * (color.rgba*0.1) );

    float resultAlpha = outerGlowAlpha;
    return vec4(color.rgb * resultAlpha, resultAlpha);
}

vec4 ripples(vec2 suv) 
{
    suv.x += time/2.;
    vec3 c1 = ( 0.0 ) * (color.rgb*10.);
    vec3 c2 = vec3(c1);
    vec3 c3 = vec3(c1);
    vec3 c4 = vec3( color.r*5., color.g*3.3333, color.b*2. );
    vec3 c5 = vec3(c3);
    vec3 c6 = vec3(c1);
    vec2 p = suv;
    float q = 2.*fbm(p + time*0.2);
    vec2 r = vec2(fbm(p + q + ( time*0.1  ) - p.x - p.y), fbm(p + p + ( time*0.1 )));
    vec3 c = color.rgb * (
        mix( c1, c2, fbm( p + r ) ) + mix( c3, c4, r.x ) - mix( c5, c6, r.y )
    );
    return vec4(c,1.);
}

vec4 noisy(vec2 suv)
{
    vec4 noiseColor;
    noiseColor.rgb = (color.rgb * noise(suv + fbm(suv) + time));
    noiseColor.a = 1.;
    return clamp(noiseColor,0.,1.);
}

void main(void) 
{

    vec4 pixel = texture2D(uSampler,vTextureCoord);

    if (pixel.a == 1.) {
        gl_FragColor =  pixel;
    } else {
        vec4 glowlevel = glowing();
        vec4 outlinelevel = outlining();
        vec4 aura;
        
        if (auraType <= 1) {
            aura = ripples(vFilterCoord*20.*scale);
        } else {
            aura = noisy(vFilterCoord*20.*scale);
        }

        vec4 effect;
        effect = ((glowlevel*subAuraIntensity)*0.1) + ((outlinelevel*auraIntensity)*0.8);

        if (effect.a >= 0.) {effect.rgb = aura.rgb*(max(effect.a,0.));}

        float intensity = effect.r + effect.g + effect.b;
	    if(intensity < threshold && effect.a != 0.) {
            if (holes) {discard;}
            effect.rgb = (color.rgb)*(effect.a*0.5);
        } 

        gl_FragColor =  pixel + effect * (1.-pixel.a);
    }
}
`;
