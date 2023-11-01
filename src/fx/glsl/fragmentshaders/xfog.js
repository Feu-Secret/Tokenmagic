export const xFog = `
precision mediump float;

uniform float time;
uniform vec3 color;
uniform bool alphaDiscard;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float PI = 3.14159265;
const mat3 rotationMatrix = mat3(1.0,0.0,0.0,0.0,0.47,-0.88,0.0,0.88,0.47);
	
float hash(float p)
{
    return fract(sin(dot(vec2(p*0.00010,0.),vec2(12.9898,78.233))) * 43758.5453);
}

float noise( vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+0.0  ), hash(n+1.0),f.x),mix( hash(n+57.0 ), hash(n+58.0 ),f.x),f.y),
           mix(mix( hash(n+113.0), hash(n+114.0),f.x),mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
} 

vec4 map( vec3 p )
{
	float d = 0.2 - p.y;	
	vec3 q = p  - vec3(0.0,1.0,0.0)*time;
	float f  = 0.5*noise( q ); q = q*2.02 - vec3(0.25,0.25,0.25)*time*0.4;
	f += 0.25*noise( q ); 
    q = q*2.03 - vec3(0.0,1.0,0.0)*time*0.2;
	f += 0.125*noise( q ); 
	d = clamp( d + 4.5*f, 0.0, 1.0 );
	vec3 col = mix( vec3(0.9,0.9,0.9), vec3(0.1,0.1,0.1), d ) + 0.05*sin(p);
	return vec4( col, d );
}

vec3 cloudify( vec3 ro, vec3 rd )
{
	vec4 s = vec4(0.);
	float t = 0.0;
    vec3 col = color*0.75;
    vec3 p;
    vec4 k;

	for( int i=0; i<90; i++ )
	{
		if( s.a > 0.97 ) break;
		p = ro + t*rd;
		k = map( p );
		k.rgb *= mix( col, color, clamp( (p.y-0.2)*0.5, 0.0, 1.0 ) );
		k.a *= 0.5;
		k.rgb *= k.a;
		s = s + k*(1.0-s.a);	
		t += 0.05;
	}
	return clamp( s.xyz, 0.0, 1.0 );
}

vec4 xfog()
{
	vec3 vo = vec3(0.0,4.9,-40.);
	vec3 vd = normalize(vec3(vFilterCoord.xy, 1.)) * rotationMatrix * 2.25;
	vec3 volume = cloudify( vo, vd );
	volume *= volume;
	return vec4( volume, 1.0 );
}

void main() 
{
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a == 0.) discard;
    vec4 result = max( xfog(), pixel) * pixel.a;
    if (alphaDiscard && all(lessThanEqual(result.rgb,vec3(0.15)))) discard;
    gl_FragColor = result;
}
`;
