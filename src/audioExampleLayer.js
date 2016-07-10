/**
 * @constructor
 */
function audioExampleLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.cube = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),
    new THREE.MeshBasicMaterial({color: 0x000fff}));

  this.scene.add(this.cube);

  var light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(-50, -50, -50);
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  this.camera.position.z = 100;

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

audioExampleLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

audioExampleLayer.prototype.start = function() {
};

audioExampleLayer.prototype.end = function() {
};

audioExampleLayer.prototype.resize = function() {
};

audioExampleLayer.prototype.update = function(frame, relativeFrame) {
  this.cube.scale.z = 5 * (
      1 + Math.max(window.audioAnalysis['snare.wav']['spectral_energy'][frame], 0)
    );
};

audioExampleLayer.prototype.render = function(renderer, interpolation) {
};
