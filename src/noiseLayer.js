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
  this.shaderPass.uniforms.time.value = frame;
  if (BEAN < 1056) {
    this.shaderPass.uniforms.amount.value = 0.1 + 0.018 * this.snareAnalysis.getValue(frame);
  } else {
    this.shaderPass.uniforms.amount.value = 0.05 + 0.01 * this.snareAnalysis.getValue(frame);
  }
};

noiseLayer.prototype.render = function() {
};

noiseLayer.prototype.start = function() {
};

noiseLayer.prototype.end = function() {
};
