uniform float time;
uniform sampler2D tDiffuse;

varying vec2 vUv;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec4 texColor = vec4(0);
    float whiteNoise = 999.0;

    vec2 uv = vUv;
    
    uv.x = uv.x + (rand(vec2(0., uv.y - mod(uv.y, rand(vec2(time, time)) * .01)))-0.5)/64.0;
    uv.y = uv.y+(rand(vec2(time))-0.5)/32.0;
    uv.y = mod(uv.y + time / 20., 1.);
    texColor = texColor + .2 * rand(uv + vec2(uv.x+0.9, 0.));
    texColor += texColor + .2 * rand(vec2(time+0.9, time+0.4));
   
    texColor = texColor + texture2D(tDiffuse, vec2(uv.x, mod(uv.y + sin(time / 20.), 1.)));
    whiteNoise = rand(vec2(floor(uv.y*80.0),floor(uv.x*50.0))+vec2(time,0));
    if (whiteNoise > 1.5 - 30.0 * uv.y + 10. * tan(time) || whiteNoise < 1.5-5.0*uv.y) {
    } else {
        texColor += vec4(.9);
    }
    gl_FragColor = texColor;
}
