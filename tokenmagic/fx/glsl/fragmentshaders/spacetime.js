export const spaceTime = `
precision highp float;
precision highp int;

uniform float distortion;
uniform float time;
uniform float speed;
uniform float swirl;
uniform vec3 baseColor;
uniform float red;
uniform float green;
uniform float blue;

const int iterations = 50;
const int swirlIterations = 6;

varying vec2 vUv;
uniform sampler2D uSampler;

void main() {
    
    vec2 uv = vUv - 0.5;

    float t = speed * time * 0.1 + (
        ( 0.25 + 0.05 * sin( time * speed * 0.1 ) ) / ( length( uv.xy ) + ( 1.0  - swirl ) )
    ) * 2.2;
    float sine = sin( t * distortion );
    float cose = cos( t * 1.0 / distortion );
    mat2 matrix = mat2( -cose, sine, sine, cose );
    
    float c;
    float v1 = 0.0;
    float v2 = 0.0;
    vec3 uv3 = vec3( uv, 0.0 );
    
    for( int i = 0; i < iterations; i++ ) {
        float s = float( i ) * 0.035;
        vec3 p = s * uv3;
        p.xy *= matrix;
        p += vec3( .22,.3, s - 1.5 - sin( t * 0.13 ) * 0.1 );

        for( int i = 0; i < swirlIterations; i++ ) {
            p = abs( p ) / dot( p, p ) - 0.659;
        }

        v1 += dot( p,p ) * 0.0015 * green * ( 1.8 + sin( length( uv.xy * 13.0 ) + 0.5 - t * 0.2 ) );
        v2 += dot( p,p ) * 0.0015 * blue * ( 1.5 + sin( length( uv.xy * 13.5 ) + 2.2 - t * 0.3 ) );
        c = length( p.xy * 0.5 ) * 0.35 * red;

    }
    
    float len = length( uv );
    v1 *= smoothstep( 0.7, 0.0, len );
    v2 *= smoothstep( 0.6, 0.0, len );
    
    float r = clamp( c, 0.0, 1.0 );
    float g = clamp( ( v1 + c ) * 0.25, 0.0, 1.0 );
    float b = clamp( v2, 0.0, 1.0 );
    vec3 col = baseColor * vec3( r, g, b ) + smoothstep( 0.15, 0.0, len ) * 0.9;
    
    vec4 pixel = texture2D(uSampler, vUv);
    vec4 effect = vec4(col,0.4);

    if (pixel.a > 0.) {
        gl_FragColor = mix(pixel, effect, pixel.a*effect.a);
    } else {
        gl_FragColor = pixel;
    }
}
`;