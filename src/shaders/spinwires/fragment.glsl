uniform float time;
uniform float lightOpening;
uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec4 vModelPosition;

void main() {
    vec4 dark = vec4(.8, .5, .3, 0.1);
    vec4 light = vec4(.8, .5, .3, 1.);
    float width = 1.5;
    if(vModelPosition.y < -21.) {
        light.r = 0.7098;
        light.g = 0.6510;
        light.b = 0.2588;
        light *= 0.5;
        dark.a = 0.;
    }
    vec4 color = mix(light * 1., dark, min(1., abs(vModelPosition.x / width)));
    if(vModelPosition.y >= -21.) {
        color.a = max(color.a, dark.a);
    }
    if(vModelPosition.z < 88.) {
        color.a = mix(dark.a, color.a, clamp(0., 1., (vModelPosition.z - 86.) / 2.));
    }
    if(vModelPosition.z > 85. + 27. * lightOpening) {
        color.a = mix(color.a, dark.a, clamp(0., 1., (vModelPosition.z - 85. - 27. * lightOpening) / 2.));
    }
    gl_FragColor = color;
}
