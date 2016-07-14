/**
 * @constructor
 */
function glitchLayer(layer) {
  this.shaderPass = new THREE.ShaderPass(SHADERS.glitch);
}

glitchLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

glitchLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.amount.value = 1;
  this.shaderPass.uniforms.time.value = frame;
};

glitchLayer.prototype.render = function() {
};

glitchLayer.prototype.start = function() {
};

glitchLayer.prototype.end = function() {
};
