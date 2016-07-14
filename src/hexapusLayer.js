
/**
 * @constructor
 */
function hexapusLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

  this.arms = [];
  this.n_cubes = 9;
  this.hexapus = new THREE.Mesh();
  for(a = 0; a < 6; a++){
    this.arms[a] = [];
    for(i = 0; i < this.n_cubes; i++){
      var cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3),
            new THREE.MeshBasicMaterial({ color: 0x000fff }));
      this.hexapus.add(cube)
      this.arms[a][i] = cube;
    }
  }

  this.scene.add(this.hexapus);
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

hexapusLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

hexapusLayer.prototype.start = function() {
};

hexapusLayer.prototype.end = function() {
};

hexapusLayer.prototype.resize = function() {
};

hexapusLayer.prototype.update = function(frame, relativeFrame) {
  for(a = 0; a < 6; a++){
    for(i = 0; i < this.n_cubes; i++){
      this.arms[a][i].position.set( (a==0)*i-(a==1)*i,
                                    (a==2)*i-(a==3)*i,
                                    (a==4)*i-(a==5)*i);
      //length of arms:
      this.arms[a][i].position.multiplyScalar(9);

      var stiff = 9;
      var rotdist = 1.2;
      var rotspeed = 20;

      //Rotation formulas
      var xmagic = rotdist * Math.sin(frame/rotspeed - i/stiff);
      var ymagic = rotdist * Math.cos(frame/rotspeed - i/stiff);
      var zmagic = rotdist * Math.sin(frame/rotspeed - i/stiff + 1);
      this.arms[a][i].position.applyAxisAngle(new THREE.Vector3(1,0,0), xmagic);
      this.arms[a][i].position.applyAxisAngle(new THREE.Vector3(0,1,0), ymagic);
      this.arms[a][i].position.applyAxisAngle(new THREE.Vector3(0,0,1), zmagic);
    }
  }
};

hexapusLayer.prototype.render = function(renderer, interpolation) {
};
;
