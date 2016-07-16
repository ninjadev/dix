/**
 * @constructor
 */
function vignetteLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.vignette);

  this.random = Random(0x90);
}

vignetteLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

vignetteLayer.prototype.start = function() {
};

vignetteLayer.prototype.end = function() {
};

vignetteLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.amount.value = 1;
};

vignetteLayer.prototype.resize = function() {
};

vignetteLayer.prototype.render = function(renderer, interpolation) {
};
