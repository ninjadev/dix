uniform float time;
uniform sampler2D tDiffuse;

varying vec2 vUv;


vec2 res = vec2(16, 9);

void main() {
    vec4 col = vec4(vUv.x*abs(sin(time/100.)),
                    vUv.y*abs(cos(time/100.)),
                    abs(sin(time/100.)),
                    1);

    gl_FragColor = col;
}
