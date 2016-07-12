/**
 * @constructor
 */
function distortionLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.distortion);
}

distortionLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

distortionLayer.prototype.start = function() {
};

distortionLayer.prototype.end = function() {
};

distortionLayer.prototype.update = function(frame, relativeFrame) {
    this.shaderPass.uniforms.time.value = relativeFrame;
};

distortionLayer.prototype.resize = function() {
};

distortionLayer.prototype.render = function(renderer, interpolation) {
};
