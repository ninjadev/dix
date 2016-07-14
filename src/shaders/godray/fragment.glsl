uniform float time;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    float alpha = vUv.y;
    float random = rand(vUv * time);
    gl_FragColor = vec4(1., 1., 1., vUv.y * vUv.y * 0.1 + random * 0.03);
}
