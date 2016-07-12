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


  var light2 = new THREE.PointLight( 0xffffff, 1, 100 );
  light2.position.set( -10, -10, -10 );
  this.scene.add(light2);

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

  this.gear1 = new THREE.Object3D();
  this.gear1.position.x = 0.17 - 0.177;
  this.gear1.position.y = -0.41 + 0.41; 
  this.gear1.position.z = -(2.24 + 0.04); // rev

  this.gear2 = new THREE.Object3D();
  this.gear2.position.x = -1.400 + 0;
  this.gear2.position.y = 0.643 + 0; 
  this.gear2.position.z = -(2.400 + 0); // rev

  this.gear3 = new THREE.Object3D();
  this.gear3.position.x = -1.335 + 0;
  this.gear3.position.y = -0.536 + 0; 
  this.gear3.position.z = -(2.172 + 0); // rev

  this.gear4 = new THREE.Object3D();
  this.gear4.position.x = -0.311 + 0;
  this.gear4.position.y = -3.1167 + 1.984; 
  this.gear4.position.z = -(1.974 + 0.236); // rev

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
  loadObject(prefix + 'gear1.obj', clock_material, this.gear1);
  loadObject(prefix + 'gear2.obj', clock_material, this.gear2);
  loadObject(prefix + 'gear3.obj', clock_material, this.gear3);
  loadObject(prefix + 'gear4.obj', clock_material, this.gear4);
  this.scene.add(this.clock_body);
  this.scene.add(this.pendulum);
  this.scene.add(this.second_hand);
  this.scene.add(this.minute_hand);
  this.scene.add(this.hour_hand);
  this.scene.add(this.gear1);
  this.scene.add(this.gear2);
  this.scene.add(this.gear3);
  this.scene.add(this.gear4);
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

  this.gear1.rotation.z = -0.01 * frame;
  this.gear2.rotation.z = -0.01 * frame;
  this.gear3.rotation.z = -0.01 * frame;
  this.gear4.rotation.z = -0.01 * frame;
};

clockLayer.prototype.render = function(renderer, interpolation) {
};
