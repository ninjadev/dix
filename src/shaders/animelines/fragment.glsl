uniform float time;
uniform float variant;
uniform vec3 colorA;
uniform vec3 colorB;
uniform sampler2D tDiffuse;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

float draw_circle(vec2 position, vec2 scale) {
    vec2 uv = vUv;
    uv.y = mod(uv.y * 2., 1.);
	float distance = sqrt(pow((uv.x - position.x) * scale.x , 2.) + pow((uv.y - position.y) * scale.y, 2.));
	return 1. - min(distance, 1.0);
}

void main() {
	float motion = time;
    float intensity = 0.0;
	intensity += draw_circle(vec2(mod(motion*0.1+1.1, 2.1)-1., 0.05), vec2(2.0, 20.0));
	intensity += draw_circle(vec2(mod(motion*0.1+1.1, 2.4)-1., 0.11), vec2(2.2, 22.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.2, 2.5)-1., 0.16), vec2(2.4, 50.0));
	intensity += draw_circle(vec2(mod(motion*0.1+4.7, 2.6)-1., 0.24), vec2(2.5, 43.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.2, 2.1)-1., 0.33), vec2(2.7, 52.0));
	intensity += draw_circle(vec2(mod(motion*0.1+4.7, 2.4)-1., 0.35), vec2(2.8, 20.0));
	intensity += draw_circle(vec2(mod(motion*0.1+0.2, 2.5)-1., 0.44), vec2(2.3, 37.0));
	intensity += draw_circle(vec2(mod(motion*0.1+7.2, 2.6)-1., 0.50), vec2(2.0, 23.0));
	intensity += draw_circle(vec2(mod(motion*0.1+7.2, 2.1)-1., 0.59), vec2(2.5, 48.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.2, 2.4)-1., 0.65), vec2(2.0, 20.0));
	intensity += draw_circle(vec2(mod(motion*0.1+4.7, 2.5)-1., 0.75), vec2(1.3, 60.0));
	intensity += draw_circle(vec2(mod(motion*0.1+7.2, 2.6)-1., 0.80), vec2(1.0, 49.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.2, 2.4)-1., 0.87), vec2(2.5, 42.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.2, 2.5)-1., 0.92), vec2(2.6, 52.0));
	intensity += draw_circle(vec2(mod(motion*0.1+1.2, 2.6)-1., 0.97), vec2(2.0, 58.0));
	intensity += draw_circle(vec2(mod(motion*0.1+4.7, 2.1)-1., 0.06), vec2(1.8, 20.0));
	intensity += draw_circle(vec2(mod(motion*0.1+7.2, 2.4)-1., 0.14), vec2(2.0, 22.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.2, 2.5)-1., 0.12), vec2(2.0, 50.0));
	intensity += draw_circle(vec2(mod(motion*0.1+4.7, 2.6)-1., 0.29), vec2(2.9, 43.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.9, 2.1)-1., 0.39), vec2(2.8, 52.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.2, 2.4)-1., 0.31), vec2(2.0, 20.0));
	intensity += draw_circle(vec2(mod(motion*0.1+4.7, 2.5)-1., 0.90), vec2(2.3, 37.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.2, 2.6)-1., 0.74), vec2(2.0, 23.0));
	intensity += draw_circle(vec2(mod(motion*0.1+4.7, 2.1)-1., 0.88), vec2(1.4, 48.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.2, 2.4)-1., 0.90), vec2(1.9, 22.0));
	intensity += draw_circle(vec2(mod(motion*0.1+4.7, 2.5)-1., 0.92), vec2(2.3, 59.0));
	intensity += draw_circle(vec2(mod(motion*0.1+2.2, 2.6)-1., 0.95), vec2(2.0, 49.0));
	intensity += draw_circle(vec2(mod(motion*0.1+4.7, 2.4)-1., 0.99), vec2(2.5, 42.0));
	intensity += draw_circle(vec2(mod(motion*0.1+9.9, 2.5)-1., 0.08), vec2(2.4, 52.0));
	intensity += draw_circle(vec2(mod(motion*0.1+0.0, 2.6)-1., 0.97), vec2(2.3, 58.0));
    
    float invertAmount = 0.3 * sin(vUv.y * 5. + time * 0.05 - vUv.x * 3.14) + 0.7;
    intensity = mix(intensity, 1. - intensity, invertAmount);
    intensity *= (0.25 - 0.75 * cos(vUv.y * PI * 2.));
    vec3 color = mix(colorA, colorB, intensity);
    gl_FragColor = vec4(color, 1.);
}
