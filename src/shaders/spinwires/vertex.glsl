uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec4 vModelPosition;

void main() {
    vUv = uv;
    vModelPosition = modelMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
