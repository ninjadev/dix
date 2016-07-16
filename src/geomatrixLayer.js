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
  for(var i = 1; i < 13; i++) {
    var num = new THREE.Mesh(new THREE.PlaneGeometry(40, 40),
                             new THREE.MeshBasicMaterial({
                               transparent: true,
                               map: new THREE.Texture(this.generateNumber(i))
                             })
      );
    num.position.z = 20;
    num.position.y = Math.cos(i/12 * (Math.PI * 2))*60;
    num.position.x = Math.sin(i/12 * (Math.PI * 2))*60;

    this.numbers.push(num);
    this.scene.add(num);
  }

  this.plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 440),
                              new THREE.ShaderMaterial(SHADERS.lolshader));
  this.plane.rotation.x = 0;
  this.plane.rotation.z = -Math.PI / 4;
  this.plane.position.z = -10;
  this.scene.add(this.plane);
  this.snareAnalysis = new audioAnalysisSanitizer('hihats.wav', 'spectral_energy', 0.55)

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

geomatrixLayer.prototype.createFloppyArms = function() {
  //long arm
  this.n_cubes = 10;
  this.longarm = new THREE.Object3D();
  for(i = 0; i < this.n_cubes; i++){
    var cube = new THREE.Mesh(
        new THREE.SphereGeometry(3, 9, 9),
        new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.7, transparent: true }));

    this.longarm.add(cube)
  }

  this.scene.add(this.longarm);

  //short arm
  this.n_cubes = 6;
  this.shortarm = new THREE.Object3D();
  for(i = 0; i < this.n_cubes; i++){
    var cube = new THREE.Mesh(
        new THREE.SphereGeometry(3, 9, 9),
        new THREE.MeshBasicMaterial({ color: 'black', opacity: 0.7, transparent: true }));

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

  var speed = .15;
  var snarescale = 0;

  var longlen = 10;
  var shortlen = 5;

  var longflop = 1;
  var shortflop = 1;

  var slowscaler = smoothstep(
      0,
      1,
      (2000 - relativeFrame) / 2000);

  var relativeFrame = relativeFrame * slowscaler;

  for(i = 0; i < this.longarm.children.length; i++){
    var box = this.longarm.children[i];
    box.position.set( 0, i*0.6, 0);
    box.position.multiplyScalar(longlen);
    var val =  -speed* (relativeFrame) + snarescale * this.snareAnalysis.getValue(frame - i*longflop);

    //Rotation formulas
    box.position.applyAxisAngle(new THREE.Vector3(0,0,1), val);
  }

  for(i = 0; i < this.shortarm.children.length; i++){
    var box = this.shortarm.children[i];
    box.position.set( 0, i, 0);
    //length of arms:
    box.position.multiplyScalar(shortlen);



    var val =  -(speed / 12) * (relativeFrame - i*shortflop) + snarescale * this.snareAnalysis.getValue(frame - i*shortflop);

    box.position.applyAxisAngle(new THREE.Vector3(0,0,1), val);
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
  var romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  var scaledFont = 60;

  var c = document.createElement('canvas');
  var size = 256;
  c.width = size;
  c.height = size;

  var ctx = c.getContext('2d');

  // Background
  ctx.beginPath();
  ctx.arc(size/2, size/2, scaledFont * 1.1, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fill();
  ctx.stroke();

  // Text
  ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.font = scaledFont + 'px "Times New Roman", Serif';
  ctx.globalCompositeOperation = 'destination-out';

  ctx.fillText(romanNumerals[num - 1], size/2, size/2);
  ctx.fillRect(72, (size - scaledFont * 0.70) / 2, 110, 3);
  ctx.fillRect(72, (size + scaledFont * 0.6) / 2, 110, 3);

  return c;
};
