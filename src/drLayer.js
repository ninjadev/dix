/**
 * @constructor
 */
function drLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.dr);

  this.crankwork = Loader.loadTexture('res/dr-crankwork.png');
  this.steamfist = Loader.loadTexture('res/dr-steamfist.png');
  this.shaderPass.uniforms.tCrankwork.value = this.crankwork;
  this.shaderPass.uniforms.tSteamfist.value = this.steamfist;
}

drLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

drLayer.prototype.start = function() {
};

drLayer.prototype.end = function() {
};

drLayer.prototype.update = function(frame, relativeFrame) {
    this.shaderPass.uniforms.time.value = relativeFrame;
    var crankworkAmount = 0;
    var steamfistAmount = 0;
    if(frame < 1500) {
      crankworkAmount = smoothstep(0, 1, (frame - 1300) / 100);
    } else if(frame < 2000) {
      crankworkAmount = smoothstep(1, 0, (frame - 1800) / 100);
    } else if(frame < 2300) {
      steamfistAmount = smoothstep(0, 1, (frame - 2100) / 100);
    } else if(frame < 2600) {
      steamfistAmount = smoothstep(1, 0, (frame - 2400) / 100);
    } else if(frame < 3400) {
      crankworkAmount = smoothstep(0, 1, (frame - 3200) / 100);
    } else if(frame < 3700) {
      crankworkAmount = smoothstep(1, 0, (frame - 3500) / 100);
    }
    this.shaderPass.uniforms.crankworkAmount.value = crankworkAmount;
    this.shaderPass.uniforms.steamfistAmount.value = steamfistAmount;
};

drLayer.prototype.resize = function() {
};

drLayer.prototype.render = function(renderer, interpolation) {
};
