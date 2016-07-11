uniform float time;
uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vec3 color = vec3(.1, .1, .1);
    if(vPosition.z > time && vPosition.z < time + 2.) {
        color = vec3(1., 1., 1.);    
    }
    gl_FragColor = vec4(color, 1.);
}
