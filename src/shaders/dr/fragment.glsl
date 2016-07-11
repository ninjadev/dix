uniform float time;
uniform float crankworkAmount;
uniform float steamfistAmount;
uniform sampler2D tDiffuse;
uniform sampler2D tCrankwork;
uniform sampler2D tSteamfist;

varying vec2 vUv;

void main() {
    vec3 color = texture2D(tDiffuse, vUv).rgb;
    vec4 crankColor = texture2D(tCrankwork, vec2(vUv.x + 1. - crankworkAmount, vUv.y));
    vec4 steamColor = texture2D(tSteamfist, vec2(vUv.x - 1. + steamfistAmount, vUv.y));
    color = mix(color, crankColor.rgb, crankColor.a);
    color = mix(color, steamColor.rgb, steamColor.a);
    gl_FragColor = vec4(color, 1.);
}
