/**
 * @constructor
 */
function noiseLayer(layer) {
  this.shaderPass = new THREE.ShaderPass(SHADERS.noise);
}

noiseLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

noiseLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.amount.value = 0.2;
  this.shaderPass.uniforms.time.value = frame;
};

noiseLayer.prototype.render = function() {
};

noiseLayer.prototype.start = function() {
};

noiseLayer.prototype.end = function() {
};
