export const solarRipples = `
precision mediump float;
precision mediump int;

uniform vec3 color;
uniform float time;
uniform float amplitude;
uniform float intensity;
uniform bool alphaDiscard;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;

#define PI 3.14159265
#define OCTAVES 3

float random(vec2 n) 
{ 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float bornedCos(float minimum, float maximum)
{
    return (maximum-minimum)*(cos(2.*PI*time*0.05 + 1.)*0.5)+minimum;
}

float bornedSin(float minimum, float maximum)
{
    return (maximum-minimum)*(sin(2.*PI*time*0.05 + 1.)*0.5)+minimum;
}

float noise(vec2 n) 
{
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n);
	vec2 f = smoothstep(vec2(0.), vec2(1.0), fract(n));
	return mix(mix(random(b), random(b + d.yx), f.x), 
	       mix(random(b + d.xy), random(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) 
{
	float total = 0.0, amp = amplitude;
	for (int i = 0; i < OCTAVES; i++) {
		total += noise(n) * amp;
		n += n;
		amp *= 0.5;
	}
	return total;
}

vec4 ripples(vec2 suv) 
{
    suv.x += time*0.5;
    vec3 c1 = color*intensity;
    vec3 c2 = vec3(0.);
    vec3 c3 = vec3(c1);
    vec3 c4 = vec3(color.r*3.333, color.g*3.333, color.b*3.333);
    vec3 c5 = vec3(c3);
    vec3 c6 = vec3(c1);
    vec2 p = suv;
    float q = 2. * fbm(p + time * 2.);
    vec2 r = vec2(fbm(p + q + ( time  ) - p.x - p.y), fbm(p + p + ( time )));
    r.x += bornedCos(-0.3,-0.2);
    r.y += 200.*bornedSin(-1.9,1.9);
    
    vec3 c = color * (
        mix( c1, c2, fbm( p + r ) ) + mix( c3, c4, r.x ) - mix( c5, c6, r.y )
    );
    return vec4(c,1.);
}

void main() {

    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    vec4 result = max(ripples(15.* vFilterCoord),pixel);
    if (alphaDiscard && all(lessThanEqual(result.rgb,vec3(0.40)))) discard;
    gl_FragColor = result*pixel.a;
}
`;
