/**
 * @constructor
 */
function colorcorrectionLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.colorcorrection);
  this.lut = Loader.loadTexture('res/colorcorrection.png');
  this.lut.generateMipMaps = false;
  this.lut.minFilter = THREE.LinearFilter;
  this.lut.magFilter = THREE.LinearFilter;
}

colorcorrectionLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

colorcorrectionLayer.prototype.start = function() {
};

colorcorrectionLayer.prototype.end = function() {
};

colorcorrectionLayer.prototype.update = function(frame, relativeFrame) {
    this.shaderPass.uniforms.time.value = relativeFrame;
    this.shaderPass.uniforms.lut.value = this.lut;
};

colorcorrectionLayer.prototype.resize = function() {
};

colorcorrectionLayer.prototype.render = function(renderer, interpolation) {
};
