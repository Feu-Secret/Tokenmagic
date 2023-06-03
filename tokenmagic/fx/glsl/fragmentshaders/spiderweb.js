export const spiderWeb = `
precision mediump float;

uniform float time;
uniform float thickness;
uniform float div1;
uniform float div2;
uniform float tear;
uniform float amplitude;
uniform bool alphaDiscard;
uniform vec2 anchor;
uniform vec3 color;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float PI = 3.14159265358;

float random(vec2 n) 
{ 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) 
{
	const vec2 d = vec2(0., 1.0);
	vec2 b = floor(n);
	vec2 f = smoothstep(vec2(0.), vec2(1.0), fract(n));
	return mix(mix(random(b), random(b + d.yx), f.x), 
	       mix(random(b + d.xy), random(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) 
{
	float total = 0.0, amp = amplitude;
	for (int i = 0; i < 2; i++) {
		total += noise(n) * amp;
		n += n;
		amp *= 0.5;
	}
	return total;
}

vec4 spiderweb()
{
    vec2 coord = vFilterCoord.xy + anchor;

    float t = floor(time * 0.01) * 7.3962;

    vec2 sc = (coord.xy - 1.) * 0.5;
    float phi = atan(sc.y, sc.x + 1e-6);
    vec2 pc = vec2(fract(phi / (PI * 2.)), length(sc));
    
    float h_divnum = div1;
    float s_divnum = div2;
    
    float ddth = fbm(vec2(pc.x*h_divnum,pc.x*20.*pow(length(sc*0.5),2.))*3.);
    
    float h_rand = 0.3+0.0895*(0.1*cos(time)+010.9)*tear;
    float s_rand = .355*(0.2*cos(time)+1.);
    
    float l = pc.y+ cos(ddth*0.5) * (h_rand - 0.4) + ddth*(s_rand - 0.5)*0.2;
    
    float ts = 0.05;
    float a = smoothstep(abs(sin(( pc.x*PI*2.  )  * s_divnum) ),-.1,thickness * ts );
    float b = smoothstep(abs(sin(( pc.y*PI*2. + h_rand + l)  * h_divnum ) ),-.1,thickness * ts );
    float s = a*b*2.;
    float m = alphaDiscard ? 1. : 2.25;
    return vec4(color.rgb*m,2.)-vec4(s,s,s,1.);
}

void main() 
{
    vec4 pixel = texture2D(uSampler,vTextureCoord);
    vec4 result = max(spiderweb(),pixel)*pixel.a;
    if (alphaDiscard && result.rgb == vec3(0.)) discard;
    gl_FragColor = result;
}
`;
