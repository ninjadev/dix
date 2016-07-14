/**
 * @constructor
 */
function phonographLayer(layer, demo) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, .1, 100000);

  this.handHeldCameraModifier = new HandHeldCameraModifier(0.00001);

  this.blackoutMaterial = new THREE.MeshBasicMaterial({color: 0});

  this.initSpinwires();

  this.audioAnalysis = new audioAnalysisSanitizer('kick.wav', 'spectral_energy', 2);

  var light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  // Whole phonograph with particles
  this.camera.position.set(0.21, 0.83, -0.21);

  this.particleDirection = [-0.99, 0.6, 0.56];
  this.spawnPosition = [
    0.62 + 0.25 * this.particleDirection[0] - 0.151,
    0.82 + 0.25 * this.particleDirection[1],
    -2.35 + 0.25 * this.particleDirection[2] + 0.115
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

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.renderPass.clear = true;
  var bloomPass = new THREE.BloomPass(2, 25, 4, 1024);
  this.glowEffectComposer = new THREE.EffectComposer(demo.renderer);
  this.glowEffectComposer.addPass(this.renderPass);
  this.glowEffectComposer.addPass(bloomPass);
  this.finalEffectComposer = new THREE.EffectComposer(demo.renderer);
  this.addPass = new THREE.ShaderPass(SHADERS.add);
  this.finalEffectComposer.addPass(this.renderPass);
}

phonographLayer.prototype.initPhonographModel = function() {
  var that = this;
  var prefix = 'res/phonograph/';
  this.phonographModel = new THREE.Object3D();
  var loadObject = function(objPath, offset, material, callback) {
    var objLoader = new THREE.OBJLoader();
    Loader.loadAjax(objPath, function(text) {
      var object = objLoader.parse(text);
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.renderMaterial = material;
          child.glowMaterial = that.blackoutMaterial;
        }
      });

      var pivot = new THREE.Object3D();
      pivot.position.set(-offset.x, -offset.y, -offset.z);
      object.position.set(
        object.position.x + offset.x,
        object.position.y + offset.y,
        object.position.z + offset.z
      );
      pivot.add(object);

      that.phonographModel.add(pivot);
      callback(pivot);
    });
  };
  loadObject(
    prefix + 'hismastervoice.obj',
    {x: 0, y: 0, z: 0},
    new THREE.MeshStandardMaterial({
      map: Loader.loadTexture(prefix + 'hismastervoice/_Wood_Cherry_Original_1.jpg'),
      side: THREE.DoubleSide
    }),
    function(object) {
      that.phonoGraphObject = object;
    }
  );
  loadObject(
    prefix + 'record.obj',
    {x: -0.5925, y: 0, z: 2.237},
    new THREE.MeshStandardMaterial({
      map: Loader.loadTexture(prefix + 'hismastervoice/text_disco.jpg')
    }),
    function(object) {
      that.recordObject = object;
      that.recordObject.position.set(
        object.position.x - 0.151,
        object.position.y,
        object.position.z + 0.115
      )
    }
  );
  loadObject(
    prefix + 'handle.obj',
    {x: 0.64971, y: -0.40482, z: 2.1225},
    new THREE.MeshStandardMaterial({
      map: Loader.loadTexture(prefix + 'hismastervoice/Wood_Cherry_Original.jpg')
    }),
    function(object) {
      that.handleObject = object;
    }
  );
  this.scene.add(this.phonographModel);
};

phonographLayer.prototype.getEffectComposerPass = function() {
  return this.addPass;
};

phonographLayer.prototype.start = function() {
};

phonographLayer.prototype.end = function() {
};

phonographLayer.prototype.resize = function() {
  this.glowEffectComposer.setSize(16 * GU, 9 * GU);
  this.finalEffectComposer.setSize(16 * GU, 9 * GU);
};

phonographLayer.prototype.updateSpinwires = function(frame, relativeFrame) {
  this.barLightGodRay.material.uniforms.time.value = frame;
  var lightOpening = lerp(0, 1, (relativeFrame - 150) / 60);
  this.shaderMaterial.uniforms.lightOpening.value = lightOpening;
  this.barLight.scale.z = lightOpening;
  this.barLightGodRay.scale.z = lightOpening;
  if(lightOpening == 0) {
    this.barLight.position.y = 34.1;
    this.barLightGodRay.scale.y = 0;
  } else {
    this.barLight.position.y = 33.9;
    this.barLightGodRay.scale.y = 1;
  }
  this.barLight.position.z = 100 - 27 / 2 + lightOpening * 27 / 2;
  this.barLightGodRay.position.z = 100 - 27 / 2 + lightOpening * 27 / 2;
  var speed = smoothstep(0.2, 1, (relativeFrame) / 1000);
  this.mainObject.rotation.y = speed * relativeFrame / 100;
  this.lightCentersActive = relativeFrame > 210;

  this.mainObject.position.x = 0.44;
  this.mainObject.position.y = 0.61 + this.audioAnalysis.getValue(frame) * 0.01;
  this.mainObject.position.z = -2.10;

  for(var i = 0; i < this.lights.length; i++) {
    var light = this.lights[i]; 
    var lightCenter = this.lightCenters[i]; 
    light.position.copy(this.curves[i].getPoint((2.75 - speed * relativeFrame / 100 / Math.PI / 2) % 1));
    lightCenter.position.copy(light.position);
  }
};
phonographLayer.prototype.update = function(frame, relativeFrame) {
  this.updateSpinwires(frame, relativeFrame - 887);
  var soundIntensity = this.guitarAnalysis.getValue(frame) * (BEAN < 1056 ? 1 : 0) +
    this.snareAnalysis.getValue(frame) +
    this.kickAnalysis.getValue(frame);
  var soundIntensityDiff = soundIntensity - this.previousSoundIntensity;
  this.phonographModel.position.x = Math.max(0, 0.005 * this.snareAnalysis.getValue(frame));
  this.phonographModel.position.y = Math.max(0, 0.01 * this.kickAnalysis.getValue(frame));

  var numNewParticles = 0 | Math.max(0, (BEAN < 1056 ? 2 : 5) * soundIntensityDiff + 0.5);

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


  if (this.recordObject) {
    this.recordObject.rotation.set(0, 0.05 * relativeFrame, 0);
  }
  if (this.handleObject) {
    this.handleObject.rotation.set(-0.08 * relativeFrame, 0, 0)
  }
};

phonographLayer.prototype.render = function(renderer, interpolation) {
  this.rigMaterialsForGlowPass();
  this.glowEffectComposer.render();
  this.rigMaterialsForRenderPass();
  this.finalEffectComposer.render();
  this.addPass.uniforms.tA.value = this.finalEffectComposer.renderTarget2;
  this.addPass.uniforms.tB.value = this.glowEffectComposer.renderTarget2;
};


phonographLayer.glowTraverse = function(object) {
  for(var i = 0; i < object.children.length; i++) {
    phonographLayer.glowTraverse(object.children[i]);
  }
  if(object instanceof THREE.Mesh) {
    object.material = object.glowMaterial;
  }
};

phonographLayer.renderTraverse = function(object) {
  for(var i = 0; i < object.children.length; i++) {
    phonographLayer.renderTraverse(object.children[i]);
  }
  if(object instanceof THREE.Mesh) {
    object.material = object.renderMaterial;
  }
};

phonographLayer.prototype.rigMaterialsForGlowPass = function() {
  for(var i = 0; i < this.tubes.length; i++) {
    this.tubes[i].material = this.shaderMaterial;
    this.mainObject.remove(this.lights[i]);
    if(this.lightCentersActive) {
      this.mainObject.add(this.lightCenters[i]);
    }
  }
  this.barLightHolder.material = this.blackoutMaterial;
  this.scene.remove(this.skyBox);
  this.scene.add(this.barLightGodRay);
  this.scene.add(this.mainObject);
  phonographLayer.glowTraverse(this.phonographModel, 'glowMaterial');
}

phonographLayer.prototype.rigMaterialsForRenderPass = function() {
  for(var i = 0; i < this.tubes.length; i++) {
    this.tubes[i].material = this.refractionMaterial;
    this.mainObject.add(this.lights[i]);
    this.mainObject.remove(this.lightCenters[i]);
  }
  this.scene.remove(this.barLightGodRay);
  this.barLightHolder.material = this.barLightHolderRenderMaterial;
  this.scene.add(this.skyBox);
  this.scene.add(this.mainObject);
  phonographLayer.renderTraverse(this.phonographModel);
}

phonographLayer.prototype.initSpinwires = function() {
  this.barLightHolderRenderMaterial = new THREE.MeshStandardMaterial({
      map: Loader.loadTexture('res/floor.jpg')
  });

  var skyGeometry = new THREE.BoxGeometry(10000, 10000, 10000);

  var skyBox = new THREE.Mesh(skyGeometry, new THREE.MeshStandardMaterial({
    map: Loader.loadTexture('res/brick.jpg'),
    side: THREE.DoubleSide
  }));
  this.scene.add(skyBox);
  this.skyBox = skyBox;

  this.barLightHolder = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 29), this.barLightHolderRenderMaterial);
  this.scene.add(this.barLightHolder);
  this.barLightHolder.position.z = 100;
  this.barLightHolder.position.y = 35;

  this.barLight = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 27),
    new THREE.MeshBasicMaterial());
  this.scene.add(this.barLight);
  this.barLight.position.z = 100;
  this.barLight.position.y = 33.9;

  this.barLightGodRay = new THREE.Mesh(
    new THREE.BoxGeometry(1, 50, 27),
    new THREE.ShaderMaterial(SHADERS.godray));
  this.barLightGodRay.material.transparent = true;
  this.scene.add(this.barLightGodRay);
  this.barLightGodRay.position.z = 100;
  this.barLightGodRay.position.y = 10;

  this.ceilingLight = new THREE.PointLight({
    color: 0xddffff  
  });
  this.ceilingLight.intensity = 0.2;
  this.ceilingLight.position.x = 0;
  this.ceilingLight.position.y = 100;
  this.ceilingLight.position.z = 0;
  this.scene.add(this.ceilingLight);

  this.ambientLight = new THREE.AmbientLight(0x202020);
  this.scene.add(this.ambientLight);

  this.cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
  this.cubeGeometry.vertices.push(new THREE.Vector3(5, 0, 5));
  this.cubeGeometry.vertices.push(new THREE.Vector3(-5, 0, 5));
  this.cubeGeometry.vertices.push(new THREE.Vector3(5, 0, -5));
  this.cubeGeometry.vertices.push(new THREE.Vector3(-5, 0, -5));
  this.cubeGeometry.vertices.push(new THREE.Vector3(0, 5, 5));
  this.cubeGeometry.vertices.push(new THREE.Vector3(0, -5, 5));
  this.cubeGeometry.vertices.push(new THREE.Vector3(0, 5, -5));
  this.cubeGeometry.vertices.push(new THREE.Vector3(0, -5, -5));
  this.geometries = [];

  this.wireframeMaterial = new THREE.MeshBasicMaterial({wireframe: true});

  this.cube = new THREE.Mesh(this.cubeGeometry, this.wireframeMaterial);

  var projectionCamera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  projectionCamera.position.x = 0;
  projectionCamera.position.y = 0;
  projectionCamera.position.z = 200;
  projectionCamera.lookAt(new THREE.Vector3(0, 0, 0));

  for(var i = 0; i < 32; i ++) {
    this.cube.rotation.x = Math.PI * 2 * i / 32 * 2;
    this.cube.rotation.z = Math.PI * 2 * i / 32;
    this.cube.updateMatrix();
    projectionCamera.updateMatrix();
    projectionCamera.updateMatrixWorld();
    this.scene.updateMatrixWorld();
    var geometry = this.cubeGeometry.clone();
    this.geometries.push(geometry);
    var modelViewMatrix = this.cube.matrixWorld.clone().multiply(projectionCamera.matrixWorldInverse);
    geometry.applyMatrix(this.cube.matrix);
    geometry.applyMatrix(modelViewMatrix);
    geometry.applyMatrix(projectionCamera.projectionMatrix);
    for(var j = 0; j < geometry.vertices.length; j++) {
      geometry.vertices[j].z = 0;
    }
    geometry.verticesNeedUpdate = true;
  }

  this.curves = [];
  this.tubes = [];
  this.tubeGeometries = [];
  this.lights = [];
  this.lightCenters = [];
  var lightCenterGeometry = new THREE.SphereGeometry(0.85, 32, 32);
  this.mainObject = new THREE.Object3D();
  var scale = 0.0012;
  this.mainObject.scale.set(scale, scale, scale);
  for(var i = 0; i < this.cube.geometry.vertices.length; i++) {
    var points = [];
    for(var j = 0; j < this.geometries.length; j++) {
      var point = this.geometries[j].vertices[i].clone();
      var rotation = new THREE.Matrix4();
      point.x += 100;
      rotation.makeRotationY(Math.PI * 2 * j / this.geometries.length);
      point.applyMatrix4(rotation);
      points.push(point);
    }
    points.push(points[0]);
    var curve = new THREE.CatmullRomCurve3(points);
    this.curves.push(curve);
    var tubeGeometry = new THREE.TubeGeometryEx(curve, 64, 1, 4);
    var shaderMaterial = new THREE.ShaderMaterial(SHADERS.spinwires);
    shaderMaterial.transparent = true;
    this.shaderMaterial = shaderMaterial;
    var refractionMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xc87533,
      envMap: this.refractionCubemap,
      shading: THREE.FlatShading,
      transparent: true,
      opacity: 0.6
    });
    this.refractionMaterial = refractionMaterial;
    var tube = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(tubeGeometry), this.refractionMaterial);
    tubeGeometry.computeFaceNormals();
    tubeGeometry.computeVertexNormals();
    this.tubeGeometries.push(tubeGeometry);
    this.tubes.push(tube);
    this.mainObject.add(tube);
    var light = new THREE.PointLight();
    light.intensity = 0.001;
    this.mainObject.add(light);
    this.lights.push(light);
    var lightCenter = new THREE.Mesh(lightCenterGeometry, new THREE.MeshBasicMaterial({
      color: 0xcc7f4c
    }));
    this.mainObject.add(lightCenter);
    this.lightCenters.push(lightCenter);
  }
  this.scene.add(this.mainObject);
};

