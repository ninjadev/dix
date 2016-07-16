/**
 * @constructor
 */
function twisterLayer(layer, demo) {
  this.config = layer.config;
  this.scene = new THREE.Scene();
  this.scrollerOffset = 0;

  this.random = new Random(1549345);

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.canvas = document.createElement('canvas');
  this.canvas.width = 1024;
  this.canvas.height = 2048;
  this.canvasCtx = this.canvas.getContext('2d');
  var canvasTexture = new THREE.Texture(this.canvas);

  this.handHeldCameraModifier = new HandHeldCameraModifier(0.00001, 934823);
  
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.renderPass.clear = true;
  var bloomPass = new THREE.BloomPass(4);
  this.glowEffectComposer = new THREE.EffectComposer(demo.renderer);
  this.glowEffectComposer.addPass(this.renderPass);
  this.glowEffectComposer.addPass(bloomPass);
  this.finalEffectComposer = new THREE.EffectComposer(demo.renderer);
  this.addPass = new THREE.ShaderPass(SHADERS.add);
  this.finalEffectComposer.addPass(this.renderPass);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  this.camera.position.z = 100;

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);

  this.snareAnalysis = new audioAnalysisSanitizer('snare.wav', 'spectral_energy', 0.03);
  this.kickAnalysis = new audioAnalysisSanitizer('kick.wav', 'spectral_energy', 0.05);

  var partialCubeResources = [
      {image: new Image(), src: 'res/brick.jpg'},
      {image: new Image(), src: 'res/brick.jpg'},
      {image: new Image(), src: 'res/brick.jpg'},
      {image: new Image(), src: 'res/brick.jpg'},
      {image: new Image(), src: 'res/brick.jpg'},
      {image: new Image(), src: 'res/brick.jpg'}
  ];
  var loadedCount = 0;
  var cubemap = new THREE.CubeTexture(partialCubeResources.map(function(item) {return item.image;}));
  for(var i = 0; i < partialCubeResources.length; i++) {
    Loader.load(partialCubeResources[i].src, partialCubeResources[i].image, function() {
      loadedCount++;
      if(loadedCount == 6) {
        cubemap.needsUpdate = true;
      }
    });
  }

  var skyGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
  this.scene.add(new THREE.AmbientLight(0x404040));

  var cubeShader = THREE.ShaderLib.cube;
  var cubeUniforms = THREE.UniformsUtils.clone(cubeShader.uniforms);
  cubeUniforms.tCube.value = cubemap;
  var skyMaterial = new THREE.ShaderMaterial({
    fragmentShader: cubeShader.fragmentShader,
    vertexShader: cubeShader.vertexShader,
    uniforms: cubeUniforms,
    side: THREE.BackSide
  });
  var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  this.scene.add(skyBox);
  this.skyBox = skyBox;

  this.glowMaterial = new THREE.MeshPhysicalMaterial({
    map: canvasTexture
  });
  this.renderMaterial = new THREE.MeshPhysicalMaterial({
    map: canvasTexture,
    roughness: 0.2,
    metalness: 0.7,
    bumpMap: canvasTexture,
    bumpMapScale: 10.,
    envMap: cubemap,
    envMapIntensity: 2
  });
  this.cube = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 200, 6, 400, true), this.renderMaterial);
  this.originalGeometry = this.cube.geometry.clone();

  this.scene.add(this.cube);
  this.cube.rotation.z = Math.PI / 2;



  this.numberOfParticles = 3500;
  this.particles = []
  this.material = new THREE.MeshBasicMaterial({ color: 0x101010 });
  this.geometry = new THREE.SphereGeometry(0.3, 8, 6);
  for(var i = 0; i < this.numberOfParticles; i++) {
    particle = new THREE.Mesh(this.geometry,this.material);
    particle.position.x = this.random() * (120) - 60;
    particle.position.x += Math.sign(particle.position.x) * 5;
    particle.position.y = this.random() * (120) - 60;
    particle.position.y += Math.sign(particle.position.y) * 5;
    particle.position.z = this.random() * (120) - 60;
    particle.position.z += Math.sign(particle.position.z) * 5;
    particle.scale = 1;
    particle.visible = false;
    this.particles.push(particle);
    this.scene.add(particle);
  }
}

twisterLayer.prototype.getEffectComposerPass = function() {
  return this.addPass;
};

twisterLayer.prototype.start = function() {
};

twisterLayer.prototype.end = function() {
};

twisterLayer.prototype.resize = function() {
  this.canvas.width = 1024;
  this.canvas.height = 2048;
  this.glowEffectComposer.setSize(16 * GU, 9 * GU);
  this.finalEffectComposer.setSize(16 * GU, 9 * GU);
};

twisterLayer.prototype.update = function(frame, relativeFrame) {
  var backup_frame = relativeFrame;
  relativeFrame += this.snareAnalysis.getValue(frame) * 20;
  var size = 1 + this.kickAnalysis.getValue(frame) * 0.12;

  this.cube.material.twisterTime  = relativeFrame / 10;
  this.cube.material.twisterAmount  = 0;
  this.scrollerOffset = -9 * relativeFrame + 1200;
  this.cube.rotation.z = Math.PI / 3 + relativeFrame / 1000;

  var rotationValue = relativeFrame / 2000 * Math.PI * 2;
  this.cube.rotation.y = rotationValue;
  this.camera.position.x = 100 * Math.sin(rotationValue);
  this.camera.position.z = 100 * Math.cos(rotationValue);
  this.camera.lookAt(this.cube.position);
  this.handHeldCameraModifier.update(this.camera);

  var rotation = new THREE.Matrix3();
  var twisterTime = relativeFrame / 10;
  for(var i = 0; i < this.cube.geometry.vertices.length; i++) {
    var position = this.originalGeometry.vertices[i];
    var w = (2. * twisterTime + (2. + 4 * Math.cos(twisterTime / 10.)) * Math.sin(twisterTime / 27.) * position.y * Math.sin(twisterTime / 20.)) / 20.;
    rotation.set(Math.cos(w), 0., Math.sin(w), 0., 1., 0., -Math.sin(w), 0., -Math.cos(w));
    var newPosition = position.clone().applyMatrix3(rotation);
    newPosition.x *= size;
    newPosition.z *= size;
    newPosition.x += 3. * Math.sin(position.y / 11. + twisterTime + (1. + .5 * Math.sin(twisterTime / 3.)));
    this.cube.geometry.vertices[i].copy(newPosition);
  }
  this.cube.geometry.verticesNeedUpdate = true;
  this.cube.geometry.computeFaceNormals();
  this.cube.geometry.computeVertexNormals();

  // particles!
  var threshold = this.snareAnalysis.getValue(frame);
  var snareScale = threshold > 1 ? threshold / 2: 1;
  for(var i; i < this.numberOfParticles; i++){
    var particle = this.particles[i];
    particle.visible = backup_frame >= 886 ? true : false;
    particle.scale.x = snareScale * 2;
    particle.scale.y = snareScale * 2;
    particle.scale.z = snareScale * 2;
  }
};

twisterLayer.prototype.rigMaterialsForGlowPass = function() {
  this.cube.material = this.glowMaterial;
  this.scene.remove(this.skyBox);
  for(var i = 0; i < this.particles.length; i++) {
    this.scene.add(this.particles[i]);
  }
}

twisterLayer.prototype.rigMaterialsForRenderPass = function() {
  this.cube.material = this.renderMaterial;
  this.scene.add(this.skyBox);
  for(var i = 0; i < this.particles.length; i++) {
    this.scene.remove(this.particles[i]);
  }
}

twisterLayer.prototype.render = function(renderer, interpolation) {
  this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.canvasCtx.save();
  this.canvasCtx.translate(this.canvas.width / 2, this.canvas.height / 2);
  this.canvasCtx.rotate(Math.PI / 2);
  this.canvasCtx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
  this.canvasCtx.font = '100px Consolas, monospace';
  this.canvasCtx.fillStyle = 'rgb(221, 176, 109)';
  var message = '    desire // farbrausch // cocoon // sandsmark // mrdoob // darklite // excess // indigo // relapse // still // nerdartz // primitive // placid // kvasigen // gargaj // ephidrena // rgba // outracks // panda cube // relapse // fnuque // truck // rohtie // T-101 // everyone at solskogen!';
  this.canvasCtx.fillText(message, this.scrollerOffset, 1024 - 250);
  this.canvasCtx.fillText(message, this.scrollerOffset, 1024 + 512 - 250);
  this.canvasCtx.restore();

  this.cube.material.map.needsUpdate = true;

  this.rigMaterialsForGlowPass();
  this.glowEffectComposer.render();
  this.rigMaterialsForRenderPass();
  this.finalEffectComposer.render();
  this.addPass.uniforms.tA.value = this.finalEffectComposer.renderTarget2;
  this.addPass.uniforms.tB.value = this.glowEffectComposer.renderTarget2;
};
