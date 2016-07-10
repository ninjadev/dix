/**
 * @constructor
 */
function clockLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 100000);
  this.cube = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),
                             new THREE.MeshBasicMaterial({ color: 0x000fff }));
  this.cube.position.y = 10;

  //this.scene.add(this.cube);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 10, 10, 10 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
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
  //clock_body.add(new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5),
  //                           new THREE.MeshBasicMaterial({ color: 0x000fff })));
  //var clock_material = new THREE.MeshBasicMaterial({ color: 0xB5A642 });
  var clock_material = new THREE.MeshLambertMaterial({
        color: 0xB5A642,
        side: THREE.DoubleSide
    });
  var loadObject = function (objPath, material) {
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
            clock_body.add(object);
        });
    };
    loadObject(prefix + 'clock_body.obj', clock_material);
    this.scene.add(clock_body)
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
};

clockLayer.prototype.render = function(renderer, interpolation) {
};
