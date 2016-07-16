/**
 * @constructor
 */
function gearRedLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.001, 100);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 10, 10, 10 );
  this.scene.add(light);

  var light2 = new THREE.PointLight( 0xffffff, 1, 100 );
  light2.position.set( -10, -10, -10 );
  this.scene.add(light2);

  var pointLight = new THREE.PointLight( 0xFFFFFF );
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);
  
  this.camera.position.x = 0;
  this.camera.position.y = 0;
  this.camera.position.z = 4;

  this.init_gear();

  this.plane = new THREE.Mesh(new THREE.PlaneGeometry(21, 12),
                             new THREE.ShaderMaterial(SHADERS.animelines));
  this.plane.rotation.x = 0;

  this.plane.position.z = -10;

  this.scene.add(this.plane);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

gearRedLayer.prototype.init_gear = function() {
  var prefix = 'res/clock/';
  var gear_material = new THREE.MeshStandardMaterial({
    color: 0xB5A642,
    metalness: 0.9,
    roughness: 0.4,
    side: THREE.DoubleSide
  });
  var loadObject = function (objPath, material, three_object) {
    var objLoader = new THREE.OBJLoader();
    Loader.loadAjax(objPath, function(text) {
      var object = objLoader.parse(text);
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = material;
        }
      });
      three_object.add(object);
    });
  };
  this.gear = new THREE.Object3D();
  loadObject(prefix + 'gear9.obj', gear_material, this.gear);
  this.scene.add(this.gear);
}

gearRedLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

gearRedLayer.prototype.start = function() {
};

gearRedLayer.prototype.end = function() {
};

gearRedLayer.prototype.resize = function() {
};

gearRedLayer.prototype.update = function(frame, relativeFrame) {
  this.plane.material.uniforms.time.value = frame;

  this.plane.material.uniforms.colorA.value = new THREE.Color(113 / 255, 17 / 255, 18 / 255);
  this.plane.material.uniforms.colorB.value = new THREE.Color(248 / 255, 225 / 255, 132 / 255);

  this.gear.rotation.z = -Math.pow(relativeFrame * 0.02, 2);

  this.gear.rotation.x = Math.PI * 2 * 0.75 + relativeFrame * 0.005;

  this.gear.position.x = -1.2 + 2.4 * relativeFrame / 270;
  this.gear.position.y = -0.7 + Math.pow(1.0 * relativeFrame / 270, 1.7);
  this.gear.position.z = relativeFrame * 0.003;
};

gearRedLayer.prototype.render = function(renderer, interpolation) {
};
