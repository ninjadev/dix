/**
 * @constructor
 */
function drLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.dr);

  this.overlay = Loader.loadTexture('res/droverlay.png');
  this.overlay.minFilter = THREE.LinearFilter;
  this.overlay.magFilter = THREE.LinearFilter;
  this.shaderPass.uniforms.tOverlay.value = this.overlay;

  this.line1 = '';
  this.line2 = '';

  this.canvas = document.createElement('canvas');
  this.canvasCtx = this.canvas.getContext('2d');
  this.canvasTexture = new THREE.Texture(this.canvas);
  this.canvasTexture.minFilter = THREE.LinearFilter;
  this.overlay.magFilter = THREE.LinearFilter;
  this.resize();
}

drLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

drLayer.prototype.start = function() {
};

drLayer.prototype.end = function() {
};

drLayer.prototype.update = function(frame, relativeFrame) {
    this.shaderPass.uniforms.time.value = relativeFrame;
    this.shaderPass.uniforms.uBackground.value = new THREE.Color(58 / 255, 85 / 255, 94 / 255);
    this.shaderPass.uniforms.tText.value = this.canvasTexture;
    this.canvasTexture.needsUpdate = true;
    var overlayAmount = 0;
    if(frame < 7350) {
      this.line1 = 'Some clocks are more efficient than others!';
      this.line2 = 'This one has 58 minutes in 1 hour.';
      overlayAmount = smoothstep(0, 1, (frame - 7150) / 50);
    }
    else if(frame < 7500) {
      overlayAmount = smoothstep(1, 0, (frame - 7400) / 100);
    }
    this.shaderPass.uniforms.overlayAmount.value = overlayAmount;
};

drLayer.prototype.resize = function() {
  var width = 0.95 - 0.26;
  var height = 0.3 - 0.1;
  this.canvas.width = 16 * GU * width;
  this.canvas.height = 9 * GU * height;
};

drLayer.prototype.render = function(renderer, interpolation) {
  this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.canvasCtx.fillStyle = 'black';
  this.canvasCtx.font = (0.5 * GU) + 'px Arial';
  this.canvasCtx.fillText(this.line1, 0.2 * GU, this.canvas.height * 0.42);
  this.canvasCtx.fillText(this.line2, 0.2 * GU, this.canvas.height * 0.80);
};
