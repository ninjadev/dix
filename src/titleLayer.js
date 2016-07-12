/**
 * @constructor
 */
function titleLayer(layer) {
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
                               transparent: true,
                               map: new THREE.Texture(this.canvas)
                             }));
  this.cube.material.map.minFilter = THREE.LinearFilter;
  this.background = new THREE.Mesh(new THREE.BoxGeometry(160, 90, 1),
                             new THREE.MeshBasicMaterial({ color: 0xffffff }));
  this.scene.add(this.background);
  this.background.position.z = -1;

  if (!document.getElementById('steamy-font')) {
    var s = document.createElement('style');
    s.setAttribute('id', 'steamy-font');
    Loader.loadAjax('res/steamy.base64', function(response) {
      s.innerHTML = [
        "@font-face {",
        "font-family: 'steamy';",
      "src: url(data:application/x-font-opentype;charset=utf-8;base64," + response + ") format('opentype');",
          "}"
      ].join('\n');
    })
    document.body.appendChild(s);
  }

  this.scene.add(this.cube);

  this.camera.position.z = 5;

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

titleLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

titleLayer.prototype.start = function() {
};

titleLayer.prototype.end = function() {
};

titleLayer.prototype.resize = function() {
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
};

titleLayer.prototype.update = function(frame, relativeFrame) {
  this.relativeFrame = relativeFrame;
  this.frame = frame;
};

titleLayer.prototype.render = function(renderer, interpolation) {
  this.canvasCtx.save();
  var scale = smoothstep(5, 1, (this.frame - 995) / (1273 - 995));
  var x = lerp(-8, 8, (this.frame - 200) / 2000);
  var y = -1.1;
  x = smoothstep(x, 0, (this.frame - 995) / (1217 - 995));
  y = smoothstep(y, 0, (this.frame - 995) / (1217 - 995));
  this.canvasCtx.translate((x + 8) * GU, (y + 4.5) * GU);
  this.canvasCtx.scale(scale, scale);
  this.canvasCtx.translate(-(x + 8) * GU, -(y + 4.5) * GU);
  this.canvasCtx.globalAlpha = 1;
  this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.canvasCtx.textAlign = 'center';
  this.canvasCtx.textBaseline = 'middle';
  this.canvasCtx.strokeStyle = 'black';

  this.canvasCtx.font = (1.5 * GU) + 'px steamy';
  this.canvasCtx.globalAlpha = smoothstep(0, 1, (this.relativeFrame - 1100) / (1217 - 1100));
  this.canvasCtx.setLineDash([Math.max(0, (this.relativeFrame - 200) / 500 * GU), 10000 * GU]);
  this.canvasCtx.fillStyle = 'black';
  this.canvasCtx.fillText('CRANKWORK', 8 * GU, 3.6 * GU);
  this.canvasCtx.fillText('STEAMFIST', 8 * GU, 5.4 * GU);
  this.canvasCtx.globalAlpha = 1 - this.canvasCtx.globalAlpha;
  this.canvasCtx.strokeText('CRANKWORK', 8 * GU, 3.6 * GU);
  this.canvasCtx.strokeText('STEAMFIST', 8 * GU, 5.4 * GU);
  this.canvasCtx.restore();

  this.cube.material.map.needsUpdate = true;
};
