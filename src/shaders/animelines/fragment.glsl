uniform float time;
uniform float variant;
uniform sampler2D tDiffuse;

varying vec2 vUv;

vec4 draw_circle(vec2 position, vec2 scale) {
	float distance = sqrt(pow((vUv.x - position.x) * scale.x , 2.) + pow((vUv.y - position.y) * scale.y, 2.));
	float in_sphere = 1. - min(distance, 1.0);
	return vec4(in_sphere, in_sphere, in_sphere, 1.0);
}

void main() {
    //gl_FragColor = vec4(0.2, 0.2, 0.5 + 0.5 * sin(time / 60.0), 1.0);

    //vec4 pixel = vec4(vUv*0.4 + vec2(0.5, 0.0), 0, 1.0);
    vec4 pixel = vec4(  (1. - variant) * (0.3 * sin(time * 0.05	 - vUv.x * 3.14) + 0.7),
    					0.,
    					variant * (0.3 * sin(-time * 0.05	 - vUv.x * 3.14) + 0.7),
    					1.0);
	float motion = (1. - variant * 2.) * time;
	pixel += draw_circle(vec2(mod(motion*0.1+1.1, 2.1)-1., 0.05), vec2(2.0, 20.0));
	pixel += draw_circle(vec2(mod(motion*0.1+1.1, 2.4)-1., 0.11), vec2(2.2, 22.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.2, 2.5)-1., 0.16), vec2(2.4, 50.0));
	pixel += draw_circle(vec2(mod(motion*0.1+4.7, 2.6)-1., 0.24), vec2(2.5, 43.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.2, 2.1)-1., 0.33), vec2(2.7, 52.0));
	pixel += draw_circle(vec2(mod(motion*0.1+4.7, 2.4)-1., 0.35), vec2(2.8, 20.0));
	pixel += draw_circle(vec2(mod(motion*0.1+0.2, 2.5)-1., 0.44), vec2(2.3, 37.0));
	pixel += draw_circle(vec2(mod(motion*0.1+7.2, 2.6)-1., 0.50), vec2(2.0, 23.0));
	pixel += draw_circle(vec2(mod(motion*0.1+7.2, 2.1)-1., 0.59), vec2(2.5, 48.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.2, 2.4)-1., 0.65), vec2(2.0, 20.0));
	pixel += draw_circle(vec2(mod(motion*0.1+4.7, 2.5)-1., 0.75), vec2(1.3, 60.0));
	pixel += draw_circle(vec2(mod(motion*0.1+7.2, 2.6)-1., 0.80), vec2(1.0, 49.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.2, 2.4)-1., 0.87), vec2(2.5, 42.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.2, 2.5)-1., 0.92), vec2(2.6, 52.0));
	pixel += draw_circle(vec2(mod(motion*0.1+1.2, 2.6)-1., 0.97), vec2(2.0, 58.0));
	pixel += draw_circle(vec2(mod(motion*0.1+4.7, 2.1)-1., 0.06), vec2(1.8, 20.0));
	pixel += draw_circle(vec2(mod(motion*0.1+7.2, 2.4)-1., 0.14), vec2(2.0, 22.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.2, 2.5)-1., 0.12), vec2(2.0, 50.0));
	pixel += draw_circle(vec2(mod(motion*0.1+4.7, 2.6)-1., 0.29), vec2(2.9, 43.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.9, 2.1)-1., 0.39), vec2(2.8, 52.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.2, 2.4)-1., 0.31), vec2(2.0, 20.0));
	pixel += draw_circle(vec2(mod(motion*0.1+4.7, 2.5)-1., 0.90), vec2(2.3, 37.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.2, 2.6)-1., 0.74), vec2(2.0, 23.0));
	pixel += draw_circle(vec2(mod(motion*0.1+4.7, 2.1)-1., 0.88), vec2(1.4, 48.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.2, 2.4)-1., 0.90), vec2(1.9, 22.0));
	pixel += draw_circle(vec2(mod(motion*0.1+4.7, 2.5)-1., 0.92), vec2(2.3, 59.0));
	pixel += draw_circle(vec2(mod(motion*0.1+2.2, 2.6)-1., 0.95), vec2(2.0, 49.0));
	pixel += draw_circle(vec2(mod(motion*0.1+4.7, 2.4)-1., 0.99), vec2(2.5, 42.0));
	pixel += draw_circle(vec2(mod(motion*0.1+9.9, 2.5)-1., 0.08), vec2(2.4, 52.0));
	pixel += draw_circle(vec2(mod(motion*0.1+0.0, 2.6)-1., 0.97), vec2(2.3, 58.0));
    
    gl_FragColor = pixel;
}
