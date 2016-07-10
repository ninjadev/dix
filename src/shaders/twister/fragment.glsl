uniform float time;
uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec3 color;

void main() {
    gl_FragColor = vec4(color, 1.);
}
