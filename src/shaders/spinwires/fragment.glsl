uniform float time;
uniform float lightOpening;
uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec4 vModelPosition;

void main() {
    vec4 dark = vec4(89. / 255., 142. / 255., 165. / 255., .1);
    vec4 light = vec4(.8, .5, .3, 1.);
    vec4 color = vec4(0., 0., 0., 1.);
    float zStart = -2.01;
    float zEnd = -1.98;
    float zWidth = abs(zStart - zEnd);
    color = dark;
    if(vModelPosition.z > zStart + zWidth - lightOpening * zWidth &&
       vModelPosition.z < zEnd &&
       vModelPosition.x < .4425 &&
       vModelPosition.x > .4395) {
       color = light;
    }
    gl_FragColor = color;
}
