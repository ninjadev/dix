uniform sampler2D tA;
uniform sampler2D tB;

varying vec2 vUv;

void main() {
    vec4 A = texture2D(tA, vUv);
    vec4 B = texture2D(tB, vUv);
    gl_FragColor = vec4(A.rgb + B.rgb, max(A.a, B.a));
}
