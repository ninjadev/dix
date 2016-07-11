/**
 * @constructor
 */
function phonographLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 100000);

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

  this.initModel();

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

phonographLayer.prototype.initModel = function() {
  var prefix = 'res/phonograph/';
  var clock_body = new THREE.Object3D();
  var material = new THREE.MeshLambertMaterial({
        color: 0xB5A642,
        side: THREE.DoubleSide
    });
  var loadObject = function (objPath, material) {
        var objLoader = new THREE.OBJLoader();
        Loader.loadAjax(objPath, function(text) {
            var object = objLoader.parse(text);
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });
            clock_body.add(object);
        });
    };
    loadObject(prefix + 'hismastervoice.obj', material);
    this.scene.add(clock_body)
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
};

phonographLayer.prototype.render = function(renderer, interpolation) {
};
