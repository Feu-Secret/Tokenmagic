export const ddTint = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 tint;
void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    float lesser = min(color.g,color.b);
    float bigger = max(color.g,color.b);
    if ((bigger - lesser < 0.1) && (color.r > 1.5 * bigger)) {
        float primary = color.r;
        float range = primary - lesser;
        color.r = lesser + range * tint.r;
        color.g = lesser + range * tint.g;
        color.b = lesser + range * tint.b;
    }
    gl_FragColor = color;
}`;
