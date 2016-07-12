uniform float time;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    float alpha = vUv.y;
    float random = rand(vec2(vUv.x - mod(vUv.x, .1), 0.)) +
                        rand(vec2(vUv.x + 0.01 - mod(vUv.x, .1), 0.)) +
                        rand(vec2(vUv.x - 0.01 - mod(vUv.x, .1), 0.)) +
                        rand(vec2(vUv.x + 0.02 - mod(vUv.x, .1), 0.)) +
                        rand(vec2(vUv.x - 0.02 - mod(vUv.x, .1), 0.));
    random /= 5.;
    gl_FragColor = vec4(1., 1., 1., vUv.y * vUv.y * random * 0.05);
}
