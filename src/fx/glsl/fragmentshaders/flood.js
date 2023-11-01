export const seaFlood = `
precision mediump float;

uniform float time;
uniform float scale;
uniform float glint;
uniform float billowy;
uniform float tintIntensity;
uniform vec2 shift;
uniform vec3 waterColor;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;
uniform mat3 filterMatrixInverse;

const float timeSpeed = 3.;

#define TWOPI 6.28318531

float randomVal (float inVal)
{
    return fract(sin(mod(dot(vec2(inVal, 2523.2361) , vec2(12.9898,78.233)), TWOPI)) * 43758.5453)-0.5;
}

vec2 randomVec2 (float inVal)
{
    return normalize(vec2(randomVal(inVal), randomVal(inVal+151.523)));
}

float makeWaves(vec2 uv, float theTime, float offset)
{
    float result = 0.0;
    float direction = 0.0;
    float sineWave = 0.0;
    vec2 randVec = vec2(0.0,0.0);
    float i;
    for(int n = 0; n < 16; n++)
    {
        i = float(n)+offset;
        randVec = randomVec2(float(i));
  		direction = (uv.x*randVec.x+uv.y*randVec.y);
        sineWave = sin(mod(direction*randomVal(i+1.6516)+theTime*timeSpeed, TWOPI));
        sineWave = smoothstep(0.2,1.,sineWave);
    	result += randomVal(i+123.0)*sineWave;
    }
    return result;
}

vec4 water( vec2 fragCoord )
{
    vec4 fragColor;
	vec2 uv = fragCoord.xy * 0.5;
    
    vec2 uv2 = uv * scale;
    
    uv *= 2.0;

    float result = 0.0;
    float result2 = 0.0;
    
    result = makeWaves( uv2+vec2(time*timeSpeed,0.0), time, 0.1);
    result2 = makeWaves( uv2-vec2(time*0.8*timeSpeed,0.0), time*0.8+1.06, 0.26);
    
    result *= 0.2;
    
    result = smoothstep(0.35,1.1,1.0-abs(result));
    result2 = smoothstep(0.35,1.1,1.0-abs(result2));
    
    result = 2.0*smoothstep(0.35,1.8,(result+result2)*glint);

    vec2 p = vec2(result, result2)*0.019 + (cos( mod(  uv*1.1 - sin(mod(uv.yx + time*timeSpeed/20., TWOPI)), TWOPI) )*0.012);
    uv.x -= shift.x;
    uv.y -= shift.y;
    uv += p * billowy;
    vec4 pixel = texture2D( uSampler , (filterMatrixInverse * vec3(uv, 1.0)).xy );
	return (vec4(result)*0.9 + pixel)*pixel.a;
}

void main() {
    vec4 water = water(vFilterCoord);
    vec4 result = mix(vec4(waterColor,1.0),water,1./(tintIntensity+1.000000001))*water.a;
    gl_FragColor = result;
}
`;
