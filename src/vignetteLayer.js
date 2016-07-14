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
    if(BEAN < 90) {
      this.shaderPass.uniforms.amount.value = (
          (smoothstep(10000, 0, relativeFrame / 442) * Math.sin(relativeFrame/2300) +
          Math.sin(relativeFrame/12)*200)
      );
    } else {
      this.shaderPass.uniforms.amount.value = 1;
    }
};

vignetteLayer.prototype.resize = function() {
};

vignetteLayer.prototype.render = function(renderer, interpolation) {
};
