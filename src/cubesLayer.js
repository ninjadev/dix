// random pattern at camera z 500
/**
 * @constructor
 */
function cubesLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  // this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.cameraController = new CameraController(layer.type);
  this.camera = this.cameraController.camera;

  this.numberOfCubes = 10000;
  this.cubes = []
  this.material = new THREE.MeshBasicMaterial({ color: 0x000fff });
  this.geometry = new THREE.SphereGeometry(0.4, 8, 6);
  for(var i = 0; i < this.numberOfCubes; i++) {
    cube = new THREE.Mesh(this.geometry,this.material);
    cube.startposition = {};
    cube.startposition.x = Math.random() * (800) - 350;
    cube.position.x = cube.startposition.x;
    cube.startposition.y = Math.random() * (400) - 200;
    cube.position.y = cube.startposition.y;
    cube.startposition.z = Math.random() * (400) - 400;
    cube.position.z = cube.startposition.z;
    this.scene.add(cube);
    this.cubes.push(cube);
  }


  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  // this.camera.position.z = -200;
  // this.camera.position.x = -200;
  // this.camera.position.y = 00;

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.snareAnalysis = new audioAnalysisSanitizer('snare.wav', 'spectral_energy', 0.45)
  this.direction = 1;
}

cubesLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

cubesLayer.prototype.start = function() {
};

cubesLayer.prototype.end = function() {
};

cubesLayer.prototype.resize = function() {
};

cubesLayer.prototype.update = function(frame, relativeFrame) {
  this.cameraController.updateCamera(relativeFrame);
  // relativeFrame += this.snareAnalysis.getValue(frame) * 40;

  // if (this.snareAnalysis.getValue(frame) > 0){
  //   this.direction *= -1;
    // this.camera.position.z = 100 + 0.5 * relativeFrame ;
    // console.log(this.camera.position.z);
    // this.camera.lookAt(this.cubes[Math.floor(Math.random() + this.numberOfCubes)])
  // }
  // this.camera.position.z = Math.cos((relativeFrame *0.03)) + Math.sin(relativeFrame * 0.04);
  // this.camera.rotation = Math.cos(frame * 0.5);
  // this.camera.rotation.y = (0.01 * frame);
  // var that = this;
  // this.cubes.forEach(function(cube, i){
  //   // cube.position.y = cube.startposition.y + (0.01 * relativeFrame);
  //   // cube.position.x = that.direction * (10 * Math.sin(i + frame / 10));
  //   // cube.position.y = that.direction * (10 * Math.cos(i + frame / 10));
  // })
};

cubesLayer.prototype.render = function(renderer, interpolation) {
};
