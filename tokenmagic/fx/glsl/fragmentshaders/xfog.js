export const xFog = `
precision mediump float;

uniform float time;
uniform vec3 color;
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
	float f  = 0.50000*noise( q ); q = q*2.02 - vec3(0.0,1.0,0.0)*time*0.4;
	f += 0.25000*noise( q ); q = q*2.03 - vec3(0.0,1.0,0.0)*time*0.2;
	f += 0.12500*noise( q ); q = q*2.01 - vec3(0.0,1.0,0.0)*time*0.3;
	f += 0.06250*noise( q ); q = q*2.02 - vec3(0.0,1.0,0.0)*time*0.3;
	f += 0.03125*noise( q );
	d = clamp( d + 4.5*f, 0.0, 1.0 );
	vec3 col = mix( vec3(1.0,0.9,0.8), vec3(0.4,0.1,0.1), d ) + 0.05*sin(p);
	return vec4( col, d );
}

vec3 cloudify( vec3 ro, vec3 rd )
{
	vec4 s = vec4( 0,0,0,0 );
	float t = 0.0;	
	for( int i=0; i<128; i++ )
	{
		if( s.a > 0.99 ) break;
		vec3 p = ro + t*rd;
		vec4 k = map( p );
		k.rgb *= mix( color*0.9, color, clamp( (p.y-0.2)*0.5, 0.0, 1.0 ) );
		k.a *= 0.5;
		k.rgb *= k.a;
		s = s + k*(1.0-s.a);	
		t += 0.05;
	}
	return clamp( s.xyz, 0.0, 1.0 );
}

vec4 xfog(vec2 fragCoord)
{
	vec3 vo = vec3(0.0,4.9,-40.);
	vec3 vd = normalize(vec3((0.7 * vFilterCoord.xy) * 1., 1.2)) * rotationMatrix * 1.5;
	vec3 volume = cloudify( vo, vd );
	volume = volume * 0.5 + 0.5 * volume * volume * (3.0 - 2.0 * volume);
	return vec4( volume, 1.0 );
}

void main() 
{
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a == 0.) discard;
    gl_FragColor = max( xfog(vFilterCoord), pixel)*pixel.a;
}
`;