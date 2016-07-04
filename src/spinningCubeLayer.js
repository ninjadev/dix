/**
 * @constructor
 */
function spinningCubeLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  this.camera.position.z = 100;

  this.cubeGrid = new THREE.Object3D();

  var colors = [new THREE.Color("rgb(58, 85, 94)"),
                new THREE.Color("rgb(77, 105, 115)"),
                new THREE.Color("rgb(40, 62, 69)")];

  for (var x=-15; x <= 15; x++) {
    for (var z=-15; z <= 15; z++) {
      var color = colors[Math.floor(Math.random()*3)];
      var cube = new THREE.Mesh(new THREE.BoxGeometry(3, 20, 3),
                                new THREE.MeshPhongMaterial({
                                  color: color}));
      cube.position.set(x * 3, (Math.random() - 1) * 5, z * 3);
      this.cubeGrid.add(cube);
    }
  }

  this.scene.add(this.cubeGrid);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

spinningCubeLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

spinningCubeLayer.prototype.start = function() {
};

spinningCubeLayer.prototype.end = function() {
};

spinningCubeLayer.prototype.resize = function() {
};

spinningCubeLayer.prototype.update = function(frame, relativeFrame) {
};

spinningCubeLayer.prototype.render = function(renderer, interpolation) {
};
