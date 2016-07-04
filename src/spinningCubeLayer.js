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

  this.camera.position.z = 200;
  this.camera.position.y = 50;

  var CubeGrid = class CubeGrid {
    constructor(nX, nZ, cubeWidth, separation, cubeHeight = 20) {
      let colors = [new THREE.Color("rgb(58, 85, 94)"),
                    new THREE.Color("rgb(77, 105, 115)"),
                    new THREE.Color("rgb(40, 62, 69)")];
      this.mesh = new THREE.Object3D();
      this.cubes = new THREE.Object3D();
      this.nX = nX;
      this.nZ = nZ;
      this.cubeHeight = cubeHeight;
      this.cubeWidth = cubeWidth;
      this.separation = separation;

      this.floor = new THREE.Mesh(
        new THREE.BoxGeometry(
            (this.nX * 2 + 1) * this.cubeWidth,
            this.cubeWidth,
            (this.nZ * 2 + 1) * this.cubeWidth),
        new THREE.MeshPhongMaterial({
          color: "rgb(146, 170, 179)"}));
      this.floor.position.y = -this.cubeHeight;

      let rr = function rr(max, min) {
        return Math.random() * (max - min) + min;
      }

      for (var x=-this.nX; x <= this.nX; x++) {
        for (var z=-this.nZ; z <= this.nZ; z++) {
          var color = colors[Math.floor(Math.random()*3)];
          var cube = new THREE.Mesh(
              new THREE.BoxGeometry(
                cubeWidth * Math.pow(rr(0.1, 1.0), 0.5),
                this.cubeHeight,
                cubeWidth * Math.pow(rr(0.1, 1.0), 0.5)),
              new THREE.MeshPhongMaterial({
                color: color}));

          cube.position.set(
              x * (this.cubeWidth + this.separation) + Math.random() * this.separation,
              0,
              z * (this.cubeWidth + this.separation) + Math.random() * this.separation);
          this.cubes.add(cube);
        }
      }

      this.mesh.add(this.floor);
      this.mesh.add(this.cubes);
    }

    update(relativeFrame) {
      for (let index in this.cubes.children) {
        let cube = this.cubes.children[index];
        let x = index % (2 * this.nX + 1);
        let z = index / (2 * this.nZ + 1);
        let offset = x + z + Math.sin(index) * 2;
        cube.position.y = Math.sin((relativeFrame + offset) / 30) * 0.5;
      }
    }
  }

  this.cg = new CubeGrid(20, 20, 10, 5);
  this.scene.add(this.cg.mesh);

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
  this.cg.update(relativeFrame);
};

spinningCubeLayer.prototype.render = function(renderer, interpolation) {
};
