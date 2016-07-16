/**
 * @constructor
 */
function endLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.OrthographicCamera( 16 / - 2, 16 / 2, 9 / 2, 9 / - 2, 0, 10 );
  this.handHeldCameraModifier = new HandHeldCameraModifier(0.0001, 0x234);
  this.canvas = document.createElement('canvas');
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
  this.canvasCtx = this.canvas.getContext('2d');
  this.bg = new THREE.Mesh(new THREE.BoxGeometry(2000, 2000, 1),
                           new THREE.MeshBasicMaterial({color: 0xff0000}));
  this.scene.add(this.bg);
  this.flashAmount = 0;
  this.bg.position.z = -3;
  this.cube = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 1),
                             new THREE.MeshBasicMaterial({
                               color: 0xffffff,
                               transparent: true,
                               map: new THREE.Texture(this.canvas)
                             }));
  this.cube.material.map.minFilter = THREE.LinearFilter;

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
  this.handHeldCameraModifier.update(this.camera);
  if(BEAN < 2034) {
    this.flashAmount *= 0.8;
  } else {
    this.flashAmount *= 0.99;
  }
  if(BEAT && BEAN == 2016 ||
     BEAT && BEAN == 2025 ||
     BEAT && BEAN == 2034) {
    this.flashAmount = 1;
  }
  this.bg.material.color.setRGB(this.flashAmount, this.flashAmount, this.flashAmount);
};

endLayer.prototype.render = function(renderer, interpolation) {
  this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.canvasCtx.textAlign = 'center';
  this.canvasCtx.textBaseline = 'middle';
  this.canvasCtx.fillStyle = 'white';
  if(this.flashAmount > 0.5 || BEAN >= 2034) {
    this.canvasCtx.fillStyle = 'black';
  }

  if(BEAN >= 2015) {
    this.canvasCtx.font = (2.5 * GU) + 'px steamy';
    this.canvasCtx.fillText('NIN', 4 * GU, 4.5 * GU);
  }

  if(BEAN >= 2024) {
    this.canvasCtx.font = (2.5 * GU) + 'px steamy';
    this.canvasCtx.fillText('JA', 8 * GU, 4.5 * GU);
  }

  if(BEAN >= 2033) {
    this.canvasCtx.font = (2.5 * GU) + 'px steamy';
    this.canvasCtx.fillText('DEV', 12.2 * GU, 4.5 * GU);
  }

  this.cube.material.map.needsUpdate = true;
};
