uniform float time;
uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec4 vModelPosition;

void main() {
    vec4 dark = vec4(.1, .1, .1, .2);
    vec4 light = vec4(1., 1., 1., 1.);
    float width = 1.0;
    vec4 color = mix(light * 3., dark, min(1., abs(vModelPosition.x / width)));
    color = color + mix(light * .2, vec4(0.), min(1., abs(vModelPosition.x / width / 5.)));
    if(vModelPosition.z < 0.) {
        color = dark;
    }
    gl_FragColor = color;
}
