/**
 * @constructor
 */
function spinwiresLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  new THREE.ShaderMaterial(SHADERS.add);

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

  this.cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
  this.geometries = [];

  this.debugCubeCounter = 0;

  this.wireframeMaterial = new THREE.MeshBasicMaterial({wireframe: true});

  this.cube = new THREE.Mesh(this.cubeGeometry, this.wireframeMaterial);

  for(var i = 0; i < 32; i ++) {
    this.cube.rotation.x = Math.PI * 2 * i / 32 * 2;
    this.cube.rotation.z = Math.PI * 2 * i / 32;
    this.cube.updateMatrix();
    this.camera.updateMatrix();
    this.camera.updateMatrixWorld();
    this.scene.updateMatrixWorld();
    var geometry = this.cubeGeometry.clone();
    this.geometries.push(geometry);
    var modelViewMatrix = this.cube.matrixWorld.clone().multiply(this.camera.matrixWorldInverse);
    geometry.applyMatrix(this.cube.matrix);
    geometry.applyMatrix(modelViewMatrix);
    geometry.applyMatrix(this.camera.projectionMatrix);
    //geometry.applyMatrix(modelViewMatrix).applyMatrix(this.camera.projectionMatrix);
    for(var j = 0; j < geometry.vertices.length; j++) {
      geometry.vertices[j].z = 0;
    }
    geometry.verticesNeedUpdate = true;
  }

  this.curves = [];
  this.tubes = [];
  for(var i = 0; i < this.cube.geometry.vertices.length; i++) {
    var points = [];
    for(var j = 0; j < this.geometries.length; j++) {
      var point = this.geometries[j].vertices[i].clone();
      point.z = j * 10;
      points.push(point);
    }
    var curve = new THREE.SplineCurve3(points);
    this.curves.push(curve);
    var tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.5, 8);
    var tube = new THREE.Mesh(tubeGeometry, new THREE.ShaderMaterial(SHADERS.spinwires));
    this.tubes.push(tube);
    this.scene.add(tube);
  }

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  this.camera.position.z = 100;

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

spinwiresLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

spinwiresLayer.prototype.start = function() {
};

spinwiresLayer.prototype.end = function() {
};

spinwiresLayer.prototype.resize = function() {
};

spinwiresLayer.prototype.update = function(frame, relativeFrame) {
  for(var i = 0; i < this.tubes.length; i++) {
    this.tubes[i].material.uniforms.time.value = relativeFrame;
  }
};

spinwiresLayer.prototype.render = function(renderer, interpolation) {
};
