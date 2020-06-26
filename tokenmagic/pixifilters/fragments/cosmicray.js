export const cosmicRayFrag = `
uniform sampler2D uSampler;
varying vec2 vTextureCoord;
precision highp float;
precision highp int;
uniform float time;
uniform vec2 dimensions;
uniform vec4 color;
uniform float divisor;

float PI = 3.14159265359,
   speed = 1.2,
   width = .5,
subdivide = 512.;

void main() {

    vec2 filterCoord = vTextureCoord / dimensions;

    vec2 uv =( filterCoord - 0.0);
    
    float len = length(uv*0.5),
   		angle = (atan(uv.x,uv.y)/(2.*PI))+1.5,
    	wobble = 48.+24.*cos(time/5.),
    	white = fract((angle)*divisor+sin((sqrt(len)*wobble)-time*speed));
    
    white  = 2.*cos(white/(PI/10.));
    white *= floor(fract(angle*divisor+sin(time/speed-(len*1.2)*wobble))*subdivide)/subdivide;
    
    vec4 color1 = smoothstep(0.,1.,white*color);
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    
    if (pixel.a > 0.1) {
        gl_FragColor = mix(pixel, color1, color1.a);
    } else {
        gl_FragColor = pixel;
    }
}
`;