uniform float time;
uniform float overlayAmount;
uniform sampler2D tDiffuse;
uniform sampler2D tOverlay;
uniform sampler2D tText;
uniform vec3 uBackground;

varying vec2 vUv;

void main() {
    vec3 color = texture2D(tDiffuse, vUv).rgb;
    vec4 overlayColor = texture2D(tOverlay, vec2(vUv.x, vUv.y + 1. - overlayAmount));
    vec3 background = uBackground;
    if(vUv.y > (1. - vUv.x) * 3. - 3.5 + 1.5 * overlayAmount) {
        background = color;
    }
    color = mix(color, overlayColor.rgb, overlayColor.a);
    color = mix(color, background, 1. - overlayColor.a);
    float width = 0.95 - 0.26;
    float height = 0.3 - 0.1;
    vec2 uv = vUv;
    if(vUv.x > 0.26 && vUv.x < 0.95 && vUv.y < 0.3 && vUv.y > 0.1) {
        uv.x -= 0.26;
        uv.y -= 0.1;
        uv.x /= 0.95 - 0.26;
        uv.y /= 0.3 - 0.1;
        vec4 textColor = texture2D(tText, uv);
        color = mix(color,
                    mix(color,
                        textColor.rgb,
                        smoothstep(0., 1., (overlayAmount - 0.95) * 20.)),
                    textColor.a);
    }
    gl_FragColor = vec4(color, 1.);
}
