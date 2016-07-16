/**
 * @constructor
 */
function fadeLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.multiply);
  this.shaderPass.uniforms.r.value = layer.config.r || 0;
  this.shaderPass.uniforms.g.value = layer.config.g || 0;
  this.shaderPass.uniforms.b.value = layer.config.b || 0;
}

fadeLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

fadeLayer.prototype.start = function() {
};

fadeLayer.prototype.end = function() {
};

fadeLayer.prototype.update = function(frame, relativeFrame) {
    this.shaderPass.uniforms.amount.value = clamp(0, 1 - frame / this.config.duration, 1);
};

fadeLayer.prototype.resize = function() {
};

fadeLayer.prototype.render = function(renderer, interpolation) {
};
