uniform float twisterTime;
uniform float tisterAmount;
uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec3 color;

void main() {
    vUv = uv;
    float w = (2. * time + (2. + sin(time / 10.)) * sin(time / 27.) * position.y * sin(time / 20.)) / 20.;
    mat3 rotation = mat3(cos(w), 0., sin(w),
                     0., 1., 0.,
                     -sin(w), 0., -cos(w));
    vec3 newpos = rotation * position;
    float size = 0.2 * sin(position.y / 10. + time);
    newpos.x += 3. * sin(position.y / 11. + time + (1. + .5 * sin(time / 3.)));
    if(sin(position.y / 4.) > 0.8) {
        color = vec3(1., 0., 0.);
    } else {
        color = vec3(0., 1., 0.);
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(mix(position, newpos, twisterAmount), 1.0);
}
