/**
 * @constructor
 */
function geomatrixLayer(layer, demo) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.camera.position.z = 200;

  this.random = Random(0x90);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, 50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  this.createFloppyArms();

  this.numbers = [];
  for(var i = 0; i < 12; i++) {
    var num = new THREE.Mesh(new THREE.PlaneGeometry(40, 40),
                             new THREE.MeshBasicMaterial({
                               transparent: true,
                               map: new THREE.Texture(this.generateNumber(''+(i+1)))
                             })
      );
    num.position.z = 20;
    num.position.y = Math.cos(i/2)*60;
    num.position.x = Math.sin(i/2)*60;

    this.numbers.push(num);
    this.scene.add(num);
  }

  this.plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 440),
                              new THREE.ShaderMaterial(SHADERS.lolshader));
  this.plane.rotation.x = 0;
  this.plane.rotation.z = -Math.PI / 4;
  this.plane.position.z = -10;
  this.scene.add(this.plane);
  this.snareAnalysis = new audioAnalysisSanitizer('hihats.wav', 'spectral_energy', 0.05)

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

geomatrixLayer.prototype.createFloppyArms = function() {
  this.n_cubes = 6;
  this.shortarm = new THREE.Object3D();
  for(i = 0; i < this.n_cubes; i++){
    var cube = new THREE.Mesh(
        new THREE.CubeGeometry( 5, 5, 5 ), 
        new THREE.MeshNormalMaterial() );

    this.shortarm.add(cube)
  }

  this.scene.add(this.shortarm);
}

geomatrixLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

geomatrixLayer.prototype.start = function() {
};

geomatrixLayer.prototype.end = function() {
};

geomatrixLayer.prototype.resize = function() {
};


geomatrixLayer.prototype.updateFloppy = function(frame, relativeFrame) {
  for(i = 0; i < this.shortarm.children.length; i++){
    var box = this.shortarm.children[i];
    box.position.set( 0, i, 0);
    //length of arms:
    box.position.multiplyScalar(10);

    var stiff = 3;
    var rotdist = 3.2;
    var rotspeed = 29;
    var kickscale = .13;


    //rotspeed -= this.kickAnalysis.getValue(frame) * .5;

    var val =  rotdist * Math.cos((relativeFrame - i*stiff)/rotspeed); // + kickscale * this.kickAnalysis.getValue(frame - i*stiff);


    //Rotation formulas
    var xmagic = val;
    var ymagic = val;
    var zmagic = val;
    box.position.applyAxisAngle(new THREE.Vector3(0,0,1), zmagic);

    //this.arms[a][i].rotation.x = Math.sin(relativeFrame / 10);
    //this.arms[a][i].rotation.y = Math.cos(relativeFrame / 10);
  }
}

geomatrixLayer.prototype.update = function(frame, relativeFrame) {
  this.updateFloppy(frame, relativeFrame);
  this.plane.material.uniforms.time.value = relativeFrame + 100*this.snareAnalysis.getValue(frame);
};

geomatrixLayer.prototype.render = function(renderer, interpolation) {
  for(var i = 0; i < this.numbers.length; i++) {
    var num = this.numbers[i];
    num.material.map.needsUpdate = true;
  }
};

geomatrixLayer.prototype.generateNumber = function(num) {
  var c = document.createElement('canvas');
  var size = 100;
  c.width = size;
  c.height = size;

  var ctx = c.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.font = '40px Arial';
  ctx.fillText(num, 38, 60);

  return c;
};
