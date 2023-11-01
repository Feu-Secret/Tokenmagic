export const magicWaves = `
precision mediump float;
precision mediump int;

uniform vec3 color;
uniform vec2 anchor;
uniform float time;
uniform bool inward;
uniform float frequency;
uniform float strength;
uniform float minIntensity;
uniform float maxIntensity;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;

void main() {

    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    float speed = inward ? 1.0 : -1.0;

    vec2 centeredUVs = vFilterCoord - anchor;
    float dist = length(centeredUVs);
    float sinVal = sin((time * speed) + (dist * frequency));
    
    float sinValNormalized = sinVal * 0.5 + 0.5;
    float lerp = ((maxIntensity - minIntensity) * sinValNormalized) + minIntensity;
    
    float rotationAmount = strength * sinVal;

    float sinX = sin ( rotationAmount );
    float cosX = cos ( rotationAmount );
    mat2 rotationMatrix = mat2( cosX, -sinX, sinX, cosX);
    vec2 newTextureCoord = vTextureCoord - vec2(0.5,0.5);

    newTextureCoord = vec2(newTextureCoord * rotationMatrix ); 
    newTextureCoord = newTextureCoord + vec2(0.5, 0.5);     
    vec4 col = texture2D(uSampler, newTextureCoord);
    
    col.rgb = col.rgb * color * lerp;
    if (col.r != 0. && col.g != 0. && col.b != 0.) {
       col.a = pixel.a;
    }

    gl_FragColor = col * pixel.a;
}
`;
