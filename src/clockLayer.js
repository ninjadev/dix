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

  this.init_room();

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

clockLayer.prototype.init_clock_model = function() {
  var prefix = 'res/clock/';
  var clock_body = new THREE.Object3D();
  var clock_material = new THREE.MeshStandardMaterial({
    color: 0xB5A642,
    metalness: 0.9,
    roughness: 0.4,
    side: THREE.DoubleSide
  });
  this.clock_body = new THREE.Object3D();

  this.pendulum = new THREE.Object3D();
  this.pendulum.position.x = 0;
  this.pendulum.position.y = 0.43 + 0.13 + 0.13;  // Tweek last param until it looks good.
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

  this.gear5 = new THREE.Object3D();
  this.gear5.position.x = 0 + 0;
  this.gear5.position.y = 0 + 0; 
  this.gear5.position.z = -(1.62 + 0.1); // rev

  this.gear6 = new THREE.Object3D();
  this.gear6.position.x = 0.966 + 0;
  this.gear6.position.y = 0.671 + 0; 
  this.gear6.position.z = -(1.560 + 0); // rev

  this.gear7 = new THREE.Object3D();
  this.gear7.position.x = -0.208 + 0.24 + 0.24 - 0.06;
  this.gear7.position.y = 1.577 + 1.62 - 1.58 - 0.02; 
  this.gear7.position.z = -(2.701 - 1.29 - 0.02 - 0.34); // rev

  this.gear8 = new THREE.Object3D();
  this.gear8.position.x = -0.09;
  this.gear8.position.y = 0.98; 
  this.gear8.position.z = -1.03; // rev

  this.gear9 = new THREE.Object3D();
  this.gear9.position.x = 0;
  this.gear9.position.y = 0; 
  this.gear9.position.z = -1.03; // rev

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
  loadObject(prefix + 'clock_body.obj', clock_material, this.clock_body);
  loadObject(prefix + 'pendulum.obj', clock_material, this.pendulum);
  loadObject(prefix + 'second_hand.obj', clock_material, this.second_hand);
  loadObject(prefix + 'minute_hand.obj', clock_material, this.minute_hand);
  loadObject(prefix + 'hour_hand.obj', clock_material, this.hour_hand);
  loadObject(prefix + 'gear1.obj', clock_material, this.gear1);
  loadObject(prefix + 'gear2.obj', clock_material, this.gear2);
  loadObject(prefix + 'gear3.obj', clock_material, this.gear3);
  loadObject(prefix + 'gear4.obj', clock_material, this.gear4);
  loadObject(prefix + 'gear3.obj', clock_material, this.gear5);
  loadObject(prefix + 'gear3.obj', clock_material, this.gear6);
  loadObject(prefix + 'gear7.obj', clock_material, this.gear7);
  loadObject(prefix + 'gear8.obj', clock_material, this.gear8);
  loadObject(prefix + 'gear9.obj', clock_material, this.gear9);
  this.scene.add(this.clock_body);
  this.scene.add(this.pendulum);
  this.scene.add(this.second_hand);
  this.scene.add(this.minute_hand);
  this.scene.add(this.hour_hand);
  this.scene.add(this.gear1);
  this.scene.add(this.gear2);
  this.scene.add(this.gear3);
  this.scene.add(this.gear4);
  this.scene.add(this.gear5);
  this.scene.add(this.gear6);
  this.scene.add(this.gear7);
  this.scene.add(this.gear8);
  this.scene.add(this.gear9);
}

clockLayer.prototype.init_room = function() {
  var skyGeometry = new THREE.BoxGeometry(50, 35, 50);
  var skyBox = new THREE.Mesh(skyGeometry, new THREE.MeshStandardMaterial({
    color: 0x404040,
    map: Loader.loadTexture('res/brick.jpg'),
    metalness: 0,
    roughness: 1,
    side: THREE.DoubleSide
  }));
  skyBox.material.map.wrapS = skyBox.material.map.wrapT = THREE.RepeatWrapping;
  skyBox.material.map.repeat.set(2, 1);
  this.scene.add(skyBox);
  this.skyBox = skyBox;
  this.skyBox.position.y = 5;
  this.ceilingLight = new THREE.PointLight({
    color: 0xddffff
  });
  this.ceilingLight.intensity = 1;
  this.ceilingLight.position.x = 0;
  this.ceilingLight.position.y = -2.5;
  this.ceilingLight.position.z = 0;
  this.scene.add(this.ceilingLight);

  this.ambientLight = new THREE.AmbientLight(0x202020);
  this.scene.add(this.ambientLight);

  this.floorMaterial = new THREE.MeshStandardMaterial({
    map: Loader.loadTexture('res/floor.jpg')
  });
  this.floorMaterial.map.repeat.set(0.5, 0.5);
  this.floor = new THREE.Mesh(new THREE.BoxGeometry(20, 7.5, 20), this.floorMaterial);
  this.floor.position.y = -15;
  this.scene.add(this.floor);
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

  var clock_speed = 0.02 + 0.3 * Math.floor(relativeFrame / 500);

  this.pendulum.rotation.z = 0.3 * Math.sin(frame * clock_speed * 2.5);

  var angle1 = clock_speed * frame * -0.1;
  var angle2 = -angle1 * 24 / 34;
  var angle3 = -angle2 * 10 / 34;
  var angle4 = -angle3 * 10 / 34;
  var angle5 = -angle4 * 10 / 34;
  var angle6 = -angle5 * 10 / 34;
  var angle7 = -angle6 * 10 / 34;
  var angle8 = -angle7 * 12 / 12;
  var angle9 = -angle8 * 12 / 24;
  
  this.second_hand.rotation.z = angle1;
  this.minute_hand.rotation.z = angle5;
  this.hour_hand.rotation.z = angle9;

  this.gear1.rotation.z = angle1;
  this.gear2.rotation.z = angle2;
  this.gear3.rotation.z = angle3;
  this.gear4.rotation.z = angle4;
  this.gear5.rotation.z = angle5 - 0.03;
  this.gear6.rotation.z = angle6;
  this.gear7.rotation.z = angle7;
  this.gear8.rotation.z = angle8;
  this.gear9.rotation.z = angle9;
};

clockLayer.prototype.render = function(renderer, interpolation) {
};
