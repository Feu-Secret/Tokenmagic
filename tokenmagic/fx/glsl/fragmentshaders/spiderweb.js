export const spiderWeb = `
precision mediump float;

uniform float time;
uniform vec2 anchor;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float PI = 3.14159265358;

float uvrand(vec2 uv)
{
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

vec4 spiderweb(vec2 fragCoord )
{
    vec2 coord = vFilterCoord.xy + anchor;

    float t = floor(time * 1.1) * 7.3962;

    vec2 sc = (coord.xy - 1.) * 0.5;
    float phi = atan(sc.y, sc.x + 1e-6);
    vec2 pc = vec2(fract(phi / (PI * 2.)), length(sc));
    
    float h_divnum = 10.; 5. + 10.*abs(sin(float(int(time))));
    float s_divnum = 10.; 5. + 10.*abs(sin(float(int(time))));
    
    float ddth = fract(pc.x * h_divnum);
    
    float h_rand = 0.09*(sin(time)+9.6)*0.56;
    float s_rand = 0.025*(cos(time)+1.)*0.5;
    
    float l = pc.y+ ddth * (h_rand - 0.4) + ddth*(s_rand - 0.5)*0.2 ;
    
    float thickness = 0.5;
    float a = step(abs(sin( ( pc.x*PI*2.  )  * s_divnum )),thickness * 0.2);
    float b = step(abs(sin( ( pc.y*PI*2. + h_rand + l)  * h_divnum )),thickness*0.2 );
    
    return vec4(a+b,a+b,a+b,1.0);
}

void main() 
{
    vec4 pixel = texture2D(uSampler,vTextureCoord);
    gl_FragColor = max(spiderweb(vFilterCoord),pixel)*pixel.a;
}
`;