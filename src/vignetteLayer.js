/**
 * @constructor
 */
function vignetteLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.vignette);
}

vignetteLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

vignetteLayer.prototype.start = function() {
};

vignetteLayer.prototype.end = function() {
};

vignetteLayer.prototype.update = function(frame, relativeFrame) {
    if(BEAN < 288) {
      this.shaderPass.uniforms.amount.value = smoothstep(10000, 0, relativeFrame / 442);
    } else {
      this.shaderPass.uniforms.amount.value = 1;
    }
};

vignetteLayer.prototype.resize = function() {
};

vignetteLayer.prototype.render = function(renderer, interpolation) {
};
