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

  this.guitarAnalysis = new audioAnalysisSanitizer('guitar.wav', 'spectral_energy', 1);
  this.snareAnalysis = new audioAnalysisSanitizer('snare.wav', 'spectral_energy', 1);
  this.kickAnalysis = new audioAnalysisSanitizer('kick.wav', 'spectral_energy', 1);

  this.smoothGuitarAnalysis = new audioAnalysisSanitizer('guitar.wav', 'spectral_energy', 0.1);
  this.smoothSnareAnalysis = new audioAnalysisSanitizer('snare.wav', 'spectral_energy', 0.1);
  this.smoothKickAnalysis = new audioAnalysisSanitizer('kick.wav', 'spectral_energy', 0.1);

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
  var lightGrayMaterial = new THREE.MeshStandardMaterial({
    color: 0x727272,
    side: THREE.DoubleSide
  });
  var aluminiumMaterial = new THREE.MeshStandardMaterial({
    //color: 0xaaa14d,
    map: Loader.loadTexture(prefix + 'hismastervoice/Metal_Aluminum_Anodized.jpg'),
    metalness: 0.8,
    roughness: 0.2,
    side: THREE.DoubleSide
  });
  var brushedMetalMaterial = new THREE.MeshStandardMaterial({
    //color: 0x545454,
    map: Loader.loadTexture(prefix + 'hismastervoice/Metal_Brushed.jpg'),
    metalness: 0.8,
    roughness: 0.3,
    side: THREE.DoubleSide
  });
  var woodMaterial = new THREE.MeshStandardMaterial({
    //color: 0x3d2616,
    map: Loader.loadTexture(prefix + 'hismastervoice/Wood_Cherry_Original.jpg'),
    roughness: 0.4,
    metalness: 0.2,
    side: THREE.DoubleSide
  });
  var blackMaterial = new THREE.MeshStandardMaterial({
    color: 0,
    side: THREE.DoubleSide
  });
  var text01Material = new THREE.MeshStandardMaterial({
    //color: 0x729c23,
    map: Loader.loadTexture(prefix + 'hismastervoice/text_01.jpg'),
    metalness: 0,
    roughness: 1,
    side: THREE.DoubleSide
  });
  var textFastMaterial = new THREE.MeshStandardMaterial({
    //color: 0x729c23,
    map: Loader.loadTexture(prefix + 'hismastervoice/text_fast.jpg'),
    side: THREE.DoubleSide
  });

  brushedMetalMaterial.map.wrapS = brushedMetalMaterial.map.wrapT = THREE.RepeatWrapping;
  woodMaterial.map.wrapS = woodMaterial.map.wrapT = THREE.RepeatWrapping;
  text01Material.map.wrapS = text01Material.map.wrapT = THREE.RepeatWrapping;
  textFastMaterial.map.wrapS = textFastMaterial.map.wrapT = THREE.RepeatWrapping;

  var materials = {
    'Mesh22_Group16_Group14_Group8_Model': textFastMaterial,
    'Mesh14_Componente_3_2_Group12_Group8_Model': woodMaterial,
    'Mesh25_Componente_1_1_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh54_Group28_Agrupar_9_1_Group24_Model': aluminiumMaterial,
    'Mesh23_Group19_Group18_Group17_Group8_Model': aluminiumMaterial,
    'Mesh29_Componente_1_5_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh38_Group25_Group24_Model': aluminiumMaterial,
    'Mesh28_Componente_1_4_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh24_Group20_Group18_Group17_Group8_Model': aluminiumMaterial,
    'Mesh53_Group31_Group28_Agrupar_9_1_Group24_Model': lightGrayMaterial,
    'Mesh19_Group12_Group8_Model': brushedMetalMaterial,
    'Mesh26_Componente_1_2_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh33_Componente_1_9_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh15_Componente_3_3_Group12_Group8_Model': woodMaterial,
    'Mesh16_Componente_3_4_Group12_Group8_Model': woodMaterial,
    'Mesh34_Componente_1_10_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh18_Group12_Group8_Model': brushedMetalMaterial,
    'Mesh36_Componente_1_12_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh12_Group13_Group12_Group8_Model': aluminiumMaterial,
    'Mesh9_Group9_Group8_Model': aluminiumMaterial,
    'Mesh11_Group11_Group8_Model': aluminiumMaterial,
    'Mesh10_Group10_Group8_Model': blackMaterial,
    'Mesh27_Componente_1_3_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh51_Group30_Group29_Group28_Agrupar_9_1_Group24_Model': lightGrayMaterial,
    'Mesh37_Group23_Group22_Group17_Group8_Model': aluminiumMaterial,
    'Mesh32_Componente_1_8_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh52_Group29_Group28_Agrupar_9_1_Group24_Model': aluminiumMaterial,
    'Mesh17_Group12_Group8_Model': woodMaterial,
    'Mesh30_Componente_1_6_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh35_Componente_1_11_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh13_Componente_3_1_Group12_Group8_Model': woodMaterial,
    'Mesh50_Group27_Agrupar_9_1_Group24_Model': aluminiumMaterial,
    'Mesh31_Componente_1_7_Group21_Group18_Group17_Group8_Model': text01Material,
    'Mesh21_Group15_Group14_Group8_Model': aluminiumMaterial,
    'Mesh20_Group12_Group8_Model': brushedMetalMaterial
  };
  this.phonographModel = new THREE.Object3D();
  var that = this;
  var loadObject = function(objPath, offset, material, callback) {
    var objLoader = new THREE.OBJLoader();
    Loader.loadAjax(objPath, function(text) {
      var object = objLoader.parse(text);
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          if (materials[child.name]) {
            child.renderMaterial = materials[child.name];
          } else {
            child.renderMaterial = material;
          }
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

      callback(pivot);
    });
  };
  loadObject(
    prefix + 'hismastervoice.obj',
    {x: 0, y: 0, z: 0},
    this.blackoutMaterial,
    function(object) {
      that.phonoGraphObject = object;
      that.phonographModel.add(object);
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
      );
      that.phonographModel.add(object);
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
      that.phonographModel.add(object);
    }
  );
  loadObject(
    prefix + 'note.obj',
    {x: 0, y: 0, z: 0},
    new THREE.MeshStandardMaterial({
      color: 0xffffff
    }),
    function(object) {
      that.initParticles(object);
    }
  );
  this.scene.add(this.phonographModel);
};

phonographLayer.prototype.initParticles = function(mesh) {
  this.particles = [];
  this.numParticles = 100;
  this.materials = [];
  for (var i = 0; i < this.numParticles; i++) {
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true});
    this.materials.push(material);
    var particle = mesh.clone();
    particle.material = material;
    particle.scale.set(0.01, 0.01, 0.01);
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
  if (lightOpening == 0) {
    this.barLight.position.y = 34.1;
    this.barLightGodRay.scale.y = 0;
  } else {
    this.barLight.position.y = 33.9;
    this.barLightGodRay.scale.y = 1;
  }
  this.barLight.position.z = 100 - 27 / 2 + lightOpening * 27 / 2;
  this.barLightGodRay.position.z = 100 - 27 / 2 + lightOpening * 27 / 2;
  this.mainObject.rotation.set(0, 0.05 * relativeFrame, 0);
  this.lightCentersActive = relativeFrame > 210;

  this.mainObject.position.x = 0.44;
  this.mainObject.position.y = 0.61 + this.audioAnalysis.getValue(frame) * 0.01;
  this.mainObject.position.z = -2.10;

  for (var i = 0; i < this.lights.length; i++) {
    var light = this.lights[i];
    var lightCenter = this.lightCenters[i];
    light.position.copy(this.curves[i].getPoint((Math.PI * 32 + 2.75 - 0.05 * relativeFrame / Math.PI / 2) % 1));
    lightCenter.position.copy(light.position);
  }
};

phonographLayer.prototype.updateParticles = function(frame, relativeFrame) {
  if (!this.particles) {
    return;
  }
  var soundIntensity = this.guitarAnalysis.getValue(frame) * (BEAN < 1056 ? 1 : 0) +
    this.snareAnalysis.getValue(frame) +
    1.5 * this.kickAnalysis.getValue(frame);
  var soundIntensityDiff = soundIntensity - this.previousSoundIntensity;

  var numNewParticles = 0 | Math.max(0, (BEAN < 1056 ? 1 : 2.5) * soundIntensityDiff + 0.5);

  var smoothSoundIntensity = this.smoothGuitarAnalysis.getValue(frame) * (BEAN < 1056 ? 1 : 0) +
    this.smoothSnareAnalysis.getValue(frame) +
    this.smoothKickAnalysis.getValue(frame);

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
      var particleScale = 0.1 * (0.7 + (1 - progress) * 0.3 * smoothSoundIntensity);

      particle.scale.set(particleScale, particleScale, particleScale)
    }
  }
  this.currentParticleIndex = (this.currentParticleIndex + numNewParticles) % this.numParticles;
  this.previousSoundIntensity = soundIntensity;
};

phonographLayer.prototype.update = function(frame, relativeFrame) {
  this.updateSpinwires(frame, relativeFrame - 887);

  this.updateParticles(frame, relativeFrame);

  this.phonographModel.position.x = Math.max(0, 0.0025 * this.snareAnalysis.getValue(frame));
  this.phonographModel.position.y = Math.max(0, 0.005 * this.kickAnalysis.getValue(frame));

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
  for (var i = 0; i < object.children.length; i++) {
    phonographLayer.glowTraverse(object.children[i]);
  }
  if (object instanceof THREE.Mesh) {
    object.material = object.glowMaterial;
  }
};

phonographLayer.renderTraverse = function(object) {
  for (var i = 0; i < object.children.length; i++) {
    phonographLayer.renderTraverse(object.children[i]);
  }
  if (object instanceof THREE.Mesh) {
    object.material = object.renderMaterial;
  }
};

phonographLayer.prototype.rigMaterialsForGlowPass = function() {
  for (var i = 0; i < this.tubes.length; i++) {
    this.tubes[i].material = this.shaderMaterial;
    this.mainObject.remove(this.lights[i]);
    if (this.lightCentersActive) {
      this.mainObject.add(this.lightCenters[i]);
    }
  }
  this.barLightHolder.material = this.blackoutMaterial;
  this.scene.remove(this.skyBox);
  this.scene.add(this.barLightGodRay);
  this.scene.add(this.mainObject);
  phonographLayer.glowTraverse(this.phonographModel, 'glowMaterial');
};

phonographLayer.prototype.rigMaterialsForRenderPass = function() {
  for (var i = 0; i < this.tubes.length; i++) {
    this.tubes[i].material = this.refractionMaterial;
    this.mainObject.add(this.lights[i]);
    this.mainObject.remove(this.lightCenters[i]);
  }
  this.scene.remove(this.barLightGodRay);
  this.barLightHolder.material = this.barLightHolderRenderMaterial;
  this.scene.add(this.skyBox);
  this.scene.add(this.mainObject);
  phonographLayer.renderTraverse(this.phonographModel);
};

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

  for (var i = 0; i < 32; i++) {
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
    for (var j = 0; j < geometry.vertices.length; j++) {
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
  for (var i = 0; i < this.cube.geometry.vertices.length; i++) {
    var points = [];
    for (var j = 0; j < this.geometries.length; j++) {
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

