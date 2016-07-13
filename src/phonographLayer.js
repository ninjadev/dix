/**
 * @constructor
 */
function phonographLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, .1, 100000);

  var light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  this.camera.position.set(0.21, 0.83, -0.21);
  this.camera.lookAt(0.21, 0.83, 0);

  this.particleDirection = [-0.99, 0.6, 0.56];
  this.spawnPosition = [
    0.62 + 0.25 * this.particleDirection[0],
    0.82 + 0.25 * this.particleDirection[1],
    -2.35 + 0.25 * this.particleDirection[2],
  ];
  this.particles = [];
  this.numParticles = 100;
  var geometry = new THREE.CubeGeometry(0.02, 0.02, 0.02);
  this.materials = [];

  for (var i = 0; i < this.numParticles; i++) {
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true});
    this.materials.push(material);
    var particle = new THREE.Mesh(geometry, material);
    particle.position.set(this.spawnPosition[0], this.spawnPosition[1], this.spawnPosition[2]);
    particle.userData.startedAt = null;
    particle.userData.direction = [
      this.particleDirection[0] + 0.5 * Math.sin(i * 97),
      this.particleDirection[1] + 0.5 * Math.sin(i * 67 + 1),
      this.particleDirection[2] + 0.5 * Math.sin(i * 167 + 2)
    ];
    this.scene.add(particle);
    this.particles.push(particle);
  }

  this.currentParticleIndex = 0;

  this.guitarAnalysis = new audioAnalysisSanitizer('guitar.wav', 'spectral_energy', 1);
  this.snareAnalysis = new audioAnalysisSanitizer('snare.wav', 'spectral_energy', 1);
  this.kickAnalysis = new audioAnalysisSanitizer('kick.wav', 'spectral_energy', 1);

  this.initPhonographModel();

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.previousSoundIntensity = 0;
}

phonographLayer.prototype.initPhonographModel = function() {
  var that = this;
  var prefix = 'res/phonograph/';
  this.phonographModel = new THREE.Object3D();
  var material = new THREE.MeshLambertMaterial({
    color: 0xB5A642,
    side: THREE.DoubleSide
  });
  var loadObject = function(objPath, material) {
    var objLoader = new THREE.OBJLoader();
    Loader.loadAjax(objPath, function(text) {
      var object = objLoader.parse(text);
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      that.phonographModel.add(object);
    });
  };
  loadObject(prefix + 'hismastervoice.obj', material);
  this.scene.add(this.phonographModel);
};

phonographLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

phonographLayer.prototype.start = function() {
};

phonographLayer.prototype.end = function() {
};

phonographLayer.prototype.resize = function() {
};

phonographLayer.prototype.update = function(frame, relativeFrame) {
  var soundIntensity = this.guitarAnalysis.getValue(frame) +
    this.snareAnalysis.getValue(frame) +
    this.kickAnalysis.getValue(frame);
  var soundIntensityDiff = soundIntensity - this.previousSoundIntensity;
  this.phonographModel.position.x = Math.max(0, 0.005 * this.snareAnalysis.getValue(frame));
  this.phonographModel.position.y = Math.max(0, 0.01 * this.kickAnalysis.getValue(frame));

  var numNewParticles = 0 | Math.max(0, 2 * soundIntensityDiff + 0.5);
  //console.log(numNewParticles);

  for (var i = 0; i < this.numParticles; i++) {
    var particle = this.particles[i];
    var relativeIndex = i - this.currentParticleIndex;
    if (relativeIndex >= 0 && relativeIndex < numNewParticles) {
      particle.userData.startedAt = relativeFrame;
    }
    if (null === particle.userData.startedAt && particle.userData.startedAt >= relativeFrame) {
      this.scene.remove(particle);
    } else {
      this.scene.add(particle);
      var progress = Math.sqrt(0.01 * (relativeFrame - particle.userData.startedAt));
      if (progress > 1) {
        particle.userData.startedAt = null;
      }
      var material = this.materials[i];
      material.opacity = 1 - progress;
      particle.position.set(
        this.spawnPosition[0] + progress * particle.userData.direction[0],
        this.spawnPosition[1] + progress * particle.userData.direction[1],
        this.spawnPosition[2] + progress * particle.userData.direction[2]
      );
    }
  }
  this.currentParticleIndex = (this.currentParticleIndex + numNewParticles) % this.numParticles;
  this.previousSoundIntensity = soundIntensity;
};

phonographLayer.prototype.render = function(renderer, interpolation) {
};
