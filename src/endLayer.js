/**
 * @constructor
 */
function endLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.OrthographicCamera( 16 / - 2, 16 / 2, 9 / 2, 9 / - 2, 0, 10 );
  this.canvas = document.createElement('canvas');
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
  this.canvasCtx = this.canvas.getContext('2d');
  this.cube = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 1),
                             new THREE.MeshBasicMaterial({
                               color: 0xffffff,
                               map: new THREE.Texture(this.canvas)
                             }));

  this.scene.add(this.cube);

  this.camera.position.z = 5;

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

endLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

endLayer.prototype.start = function() {
};

endLayer.prototype.end = function() {
};

endLayer.prototype.resize = function() {
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
};

endLayer.prototype.update = function(frame, relativeFrame) {
  this.relativeFrame = relativeFrame;
  this.frame = frame;
};

endLayer.prototype.render = function(renderer, interpolation) {
  this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.canvasCtx.textAlign = 'center';
  this.canvasCtx.textBaseline = 'middle';
  this.canvasCtx.fillStyle = 'white';

  if(BEAN >= 2015) {
    this.canvasCtx.font = (3 * GU) + 'px monospace';
    this.canvasCtx.fillText('NIN', 4 * GU, 4.5 * GU);
  }

  if(BEAN >= 2024) {
    this.canvasCtx.font = (3 * GU) + 'px monospace';
    this.canvasCtx.fillText('JA', 8 * GU, 4.5 * GU);
  }

  if(BEAN >= 2033) {
    this.canvasCtx.font = (3 * GU) + 'px monospace';
    this.canvasCtx.fillText('DEV', 12.2 * GU, 4.5 * GU);
  }

  this.cube.material.map.needsUpdate = true;
};
