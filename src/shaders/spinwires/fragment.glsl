uniform float time;
uniform float lightOpening;
uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec4 vModelPosition;

void main() {
    vec4 dark = vec4(.5, .5, .5, .0);
    vec4 light = vec4(.5, .5, .5, 1.);
    float width = 1.5;
    vec4 color = mix(light * 1., dark, min(1., abs(vModelPosition.x / width)));
    if(vModelPosition.z < 88.) {
        color.a = mix(0., color.a, (vModelPosition.z - 86.) / 2.);
    }
    if(vModelPosition.z > 85. + 27. * lightOpening) {
        color.a = mix(color.a, 0., (vModelPosition.z - 85. - 27. * lightOpening) / 2.);
    }
    if(vModelPosition.y < -21.) {
        color.r = 0.7098;
        color.g = 0.6510;
        color.b = 0.2588;
        color.a *= 0.5;
    }
    gl_FragColor = color;
}
