/**
 * @constructor
 */
function noiseLayer(layer) {
  this.shaderPass = new THREE.ShaderPass(SHADERS.noise);
  this.snareAnalysis = new audioAnalysisSanitizer('snare.wav', 'spectral_energy', 0.1);
}

noiseLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

noiseLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.amount.value = 0.15 + 0.025 * this.snareAnalysis.getValue(frame);
  this.shaderPass.uniforms.time.value = frame;
};

noiseLayer.prototype.render = function() {
};

noiseLayer.prototype.start = function() {
};

noiseLayer.prototype.end = function() {
};
