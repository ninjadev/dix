/**
 * @constructor
 */
function geomatrixLayer(layer, demo) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.camera.position.z = 100;

  this.random = Random(0x90);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  this.elements = [];
  for(var i = 0; i < 12; i++) {
    var elem = new THREE.Mesh(
      new THREE.SphereGeometry(10, 25, 25),
      new THREE.ShaderMaterial(SHADERS.colorswappy)
    );
    elem.rotation.x = 90;
    elem.position.x = Math.sin(i)*39 + (i%2==0? 10*this.random() : 0);
    elem.position.y = Math.cos(i)*39 + (i%2==0? 10*this.random() : 0);
    this.scene.add(elem);
    this.elements.push(elem);
  }

  this.plane = new THREE.Mesh(new THREE.PlaneGeometry(250, 220),
                              new THREE.ShaderMaterial(SHADERS.lolshader));
  this.plane.rotation.x = 0;
  this.plane.rotation.z = -Math.PI / 4;
  this.plane.position.z = -10;
  this.scene.add(this.plane);
  this.snareAnalysis = new audioAnalysisSanitizer('hihats.wav', 'spectral_energy', 0.05)

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
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

geomatrixLayer.prototype.update = function(frame, relativeFrame) {
  this.plane.material.uniforms.time.value = relativeFrame + 100*this.snareAnalysis.getValue(frame);

  for(var i = 0; i < this.elements.length; i++) {
    var elem = this.elements[i];
    elem.material.uniforms.time.value = frame;

    var odd = i%2==0;
    var scale = Math.sin(relativeFrame/100);
    elem.scale.set(scale, scale, scale);

    elem.position.x = Math.sin(relativeFrame/100)*20*i;
    elem.position.y = Math.cos(relativeFrame/100)*i*20*Math.sin(relativeFrame/1000);

    elem.rotation.x = Math.sin(relativeFrame/1000)*2*this.random()/10000;
  }
};

geomatrixLayer.prototype.render = function(renderer, interpolation) {
};
