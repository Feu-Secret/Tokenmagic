export const globes = `
precision mediump float;

uniform float time;
uniform float scale;
uniform float distortion;
uniform bool alphaDiscard;
uniform vec3 color;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float PI = 3.14159265358;

float rand(vec2 c)
{
	return fract( sin( dot( c.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
}

vec2 rand2(vec2 st)
{
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(cos(st)*43758.5453123);
}

vec3 toGray(vec3 color)
{
  float average = (color.r + color.g + color.b)*0.3333333;
  return vec3(average, average, average);
}

vec3 colorize(vec3 grayscale, vec3 color)
{
    return (grayscale * color);
}

float noise (vec2 st) 
{
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( rand2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( rand2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( rand2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( rand2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float circle(vec2 pos, float radius, float glow)
{
    float sdf = length(pos);
    sdf = smoothstep(radius-0.700,radius,sdf);
    float circles = 1.0 - smoothstep(0.0,1.0,sdf*1.280);
    float glows = exp(-sdf*4.496) * glow * (3.0 - circles);
    return circles+glows;
}

vec4 globes()
{
    vec2 st = (vFilterCoord - 0.5);
    st *= scale;
    vec2 uv = st;
    float noisest = noise(vec2(uv.x - time,uv.y - time));
    uv += noisest*distortion;
    uv -= vec2( noise(vec2(time)*0.2)*4.0,-time*0.01);
    
    vec3 color = vec3(0.);
    
    
    vec2 pos = fract(uv)-0.5;
    vec2 id = floor(uv);

    
    for(int y = -1; y <= 1; y++){
        for(int x = -1; x <= 1; x++){
            vec2 neighbour = vec2(x,y);
            vec2 rand2 = rand2(id+neighbour);
            float a = noise(rand2+time*2.8);
            vec2 offset = 0.5*(sin(time + rand2*5.28))*2.2;
            float size = rand(id+neighbour)*0.75 + a*0.15;
            color += circle(pos-neighbour+offset,size,size*1.400)*0.143 * vec3(rand2.x*7.884,7.2,rand2.y*6.832);
        }
    }
    
    return vec4(color,1.0);
}

void main() {
    vec4 pixel = texture2D(uSampler,vTextureCoord);

    vec4 tinyGlobes = vec4(colorize(toGray(globes().rgb*1.5),color*1.5),1.);

    bool belowThreshold = all(lessThanEqual(tinyGlobes.rgb,vec3(0.6)));
    if (alphaDiscard && belowThreshold) discard;
    else if (belowThreshold) tinyGlobes = pixel;

    gl_FragColor = max(tinyGlobes,pixel)*pixel.a;
}
`;
