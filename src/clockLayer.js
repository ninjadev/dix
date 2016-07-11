/**
 * @constructor
 */
function clockLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.001, 100);
  this.cube = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),
                             new THREE.MeshBasicMaterial({ color: 0x000fff }));
  this.cube.position.y = 10;

  //this.scene.add(this.cube);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 10, 10, 10 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight( 0xFFFFFF );
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  this.camera.position.z = 10;
  this.camera.position.y = 0;

  this.init_clock_model();

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

clockLayer.prototype.init_clock_model = function() {
  var prefix = 'res/clock/';
  var clock_body = new THREE.Object3D();
  var clock_material = new THREE.MeshLambertMaterial({
    color: 0xB5A642,
    side: THREE.DoubleSide
  });
  this.clock_body = new THREE.Object3D();

  this.pendulum = new THREE.Object3D();
  this.pendulum.position.x = 0;
  this.pendulum.position.y = 0.43 + 0.13 + 0.0;  // Tweek last param until it looks good.
  this.pendulum.position.z = -2.621;

  this.second_hand = new THREE.Object3D();
  this.second_hand.position.x = 0;
  this.second_hand.position.y = 0.007;
  this.second_hand.position.z = -2.465;

  this.minute_hand = new THREE.Object3D();
  this.minute_hand.position.x = 0.003;
  this.minute_hand.position.y = 0.004;
  this.minute_hand.position.z = -1.612;

  this.hour_hand = new THREE.Object3D();
  this.hour_hand.position.x = 0.003;
  this.hour_hand.position.y = 0.004;
  this.hour_hand.position.z = -5.196;

  var loadObject = function (objPath, material, three_object) {
    var objLoader = new THREE.OBJLoader();
    Loader.loadAjax(objPath, function(text) {
      var object = objLoader.parse(text);
      object.traverse(function(child) {
        console.log("hit");
        if (child instanceof THREE.Mesh) {
            console.log(child);
            child.material = material;
        }
      });
      three_object.add(object);
    });
  };
  loadObject(prefix + 'clock_body.obj', clock_material, this.clock_body);
  loadObject(prefix + 'pendulum.obj', clock_material, this.pendulum);
  loadObject(prefix + 'second_hand.obj', clock_material, this.second_hand);
  loadObject(prefix + 'minute_hand.obj', clock_material, this.minute_hand);
  loadObject(prefix + 'hour_hand.obj', clock_material, this.hour_hand);
  this.scene.add(this.clock_body);
  this.scene.add(this.pendulum);
  this.scene.add(this.second_hand);
  this.scene.add(this.minute_hand);
  this.scene.add(this.hour_hand);
}

clockLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

clockLayer.prototype.start = function() {
};

clockLayer.prototype.end = function() {
};

clockLayer.prototype.resize = function() {
};

clockLayer.prototype.update = function(frame, relativeFrame) {
  this.cube.rotation.x = Math.sin(frame / 10);
  this.cube.rotation.y = Math.cos(frame / 10);

  this.pendulum.rotation.z = 0.3 * Math.sin(frame / 20);

  this.second_hand.rotation.z = -0.1 * frame;
  this.minute_hand.rotation.z = -0.1 * frame / 60 ;
  this.hour_hand.rotation.z = -0.1 * frame / 3600;
};

clockLayer.prototype.render = function(renderer, interpolation) {
};
