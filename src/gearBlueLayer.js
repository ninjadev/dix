/**
 * @constructor
 */
function gearBlueLayer(layer) {
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

gearBlueLayer.prototype.init_gear = function() {
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
  loadObject(prefix + 'gear1.obj', gear_material, this.gear);
  this.scene.add(this.gear);
}

gearBlueLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

gearBlueLayer.prototype.start = function() {
};

gearBlueLayer.prototype.end = function() {
};

gearBlueLayer.prototype.resize = function() {
};

gearBlueLayer.prototype.update = function(frame, relativeFrame) {
  this.plane.material.uniforms.time.value = frame;
  this.plane.material.uniforms.variant.value = 1;

  this.gear.rotation.z = Math.pow(relativeFrame * 0.02, 2);

  this.gear.rotation.x = Math.PI * 2 * 0.75 + Math.sqrt(relativeFrame * 0.005);

  this.gear.position.x = 1.4 - 2.1 * relativeFrame / 270;
  this.gear.position.y = 0.63 - Math.pow(0.88 * relativeFrame / 270, 3);
  this.gear.position.z = relativeFrame * 0.006;
};

gearBlueLayer.prototype.render = function(renderer, interpolation) {
};
