export const removeShadowFrag = `
precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float alphaTolerance;

void main(void) {
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a <= alphaTolerance) {
        pixel = vec4(0.);
    } 
    gl_FragColor = pixel;
}
`;
