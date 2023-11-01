export const innerFog = `
precision mediump float;

uniform float time;
uniform vec3 color;
uniform float density;
uniform vec2 dimensions;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

// generates pseudo-random based on screen position
float random(vec2 pos) 
{
	return fract(sin(dot(pos.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// perlin noise
float noise(vec2 pos) 
{
	vec2 i = floor(pos);
	vec2 f = fract(pos);
	float a = random(i + vec2(0.0, 0.0));
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// fractional brownian motion
float fbm(vec2 pos) 
{
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100.);
	mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
	for (int i=0; i<16; i++) 
	{
		v = (sin(v*1.07)) + ( a * noise(pos) );
		pos = rot * pos * 1.9 + shift;
		a *= 0.5;
	}
	return v;
}

mat4 contrastMatrix(float contrast)
{
	float t = ( 1.0 - contrast ) * 0.5;
    
    return mat4( contrast, 0, 0, 0,
                 0, contrast, 0, 0,
                 0, 0, contrast, 0,
                 t, t, t, 1 );
}

vec4 fog()
{
	vec2 p = (vFilterCoord.xy * 8. - vFilterCoord.xy) * dimensions;
	
	float time2 = time * 0.0025;
	
	vec2 q = vec2(0.0);
	q.x = fbm(p);
	q.y = fbm(p);
	vec2 r = vec2(-1.0);
	r.x = fbm(p * q + vec2(1.7, 9.2) + .15 * time2);
	r.y = fbm(p * q + vec2(9.3, 2.8) + .35 * time2);
	float f = fbm(p*.2 + r*3.102);

	vec4 fogPixel = mix(
		vec4(color,1.0),
		vec4(1.5, 1.5, 1.5, 1.5),
		clamp(length(r.x), 0.4, 1.)
	);

	return (f *f * f + 0.6 * f * f + 0.5 * f) * fogPixel;
}

void main(void) 
{
    vec4 pixel = texture2D(uSampler, vTextureCoord);

    // to avoid computation on an invisible pixel.
    if (pixel.a == 0.) {
		gl_FragColor = pixel;
		return;
    }

	vec4 fogPixel = contrastMatrix(3.0)*fog();
    gl_FragColor = mix(pixel, fogPixel, 1.*density) * pixel.a;
}
`;
