/**
 * @constructor
 */
function spinwiresLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.audioAnalysis = new audioAnalysisSanitizer('kick.wav', 'spectral_energy', 2);

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.refractionCamera = new THREE.CubeCamera(0.0001, 10000, 256);
  this.reflectionCamera = new THREE.CubeCamera(0.0001, 10000, 256);
  this.scene.add(this.refractionCamera);
  this.scene.add(this.reflectionCamera);


  this.barLightHolderRenderMaterial = new THREE.MeshStandardMaterial({
      map: Loader.loadTexture('res/floor.jpg')
  });

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
    new THREE.BoxGeometry(1, 60, 27),
    new THREE.ShaderMaterial(SHADERS.godray));
  this.barLightGodRay.material.transparent = true;
  this.scene.add(this.barLightGodRay);
  this.barLightGodRay.position.z = 100;
  this.barLightGodRay.position.y = 5;

  this.blackoutMaterial = new THREE.MeshBasicMaterial({color: 0});

  this.rod = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 200, 6, 1),
      this.reflectionMaterial);
  this.scene.add(this.rod);

  var skyGeometry = new THREE.BoxGeometry(1000, 700, 1000);
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
  this.skyBox.position.y = 250;
  this.ceilingLight = new THREE.PointLight({
    color: 0xddffff  
  });
  this.ceilingLight.intensity = 1;
  this.ceilingLight.position.x = 0;
  this.ceilingLight.position.y = 100;
  this.ceilingLight.position.z = 0;
  this.scene.add(this.ceilingLight);

  this.ambientLight = new THREE.AmbientLight(0x202020);
  this.scene.add(this.ambientLight);

  this.floorMaterial = new THREE.MeshStandardMaterial({
    map: Loader.loadTexture('res/floor.jpg')
  });
  this.floorMaterial.map.repeat.set(0.5, 0.5);
  this.floor = new THREE.Mesh(new THREE.BoxGeometry(400, 150, 400), this.floorMaterial);
  this.floor.position.y = -150;
  this.scene.add(this.floor);

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

  this.debugCubeCounter = 0;

  this.wireframeMaterial = new THREE.MeshBasicMaterial({wireframe: true});

  this.cube = new THREE.Mesh(this.cubeGeometry, this.wireframeMaterial);


  for(var i = 0; i < 32; i ++) {
    this.cube.rotation.x = Math.PI * 2 * i / 32 * 2;
    this.cube.rotation.z = Math.PI * 2 * i / 32;
    this.cube.updateMatrix();
    this.camera.updateMatrix();
    this.camera.updateMatrixWorld();
    this.scene.updateMatrixWorld();
    var geometry = this.cubeGeometry.clone();
    this.geometries.push(geometry);
    var modelViewMatrix = this.cube.matrixWorld.clone().multiply(this.camera.matrixWorldInverse);
    geometry.applyMatrix(this.cube.matrix);
    geometry.applyMatrix(modelViewMatrix);
    geometry.applyMatrix(this.camera.projectionMatrix);
    for(var j = 0; j < geometry.vertices.length; j++) {
      geometry.vertices[j].z = 0;
    }
    geometry.verticesNeedUpdate = true;
  }

  this.curves = [];
  this.tubes = [];
  this.lights = [];
  this.lightCenters = [];
  var lightCenterGeometry = new THREE.SphereGeometry(0.8, 32, 32);
  this.mainObject = new THREE.Object3D();
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
    var curve = new THREE.SplineCurve3(points);
    this.curves.push(curve);
    var tubeGeometry = new THREE.TubeGeometryEx(curve, 80, 1, 8);
    var shaderMaterial = new THREE.ShaderMaterial(SHADERS.spinwires);
    shaderMaterial.transparent = true;
    this.shaderMaterial = shaderMaterial;
    this.refractionCamera.renderTarget.mapping = THREE.CubeRefractionMapping;
    var refractionMaterial = new THREE.MeshBasicMaterial({
      envMap: this.refractionCamera.renderTarget,
      reflectivity: 0.98
    });
    this.refractionMaterial = refractionMaterial;
    var reflectionMaterial = new THREE.MeshStandardMaterial({
      envMap: this.reflectionCamera.renderTarget,
      envMapIntensity: 1,
      color: 0xb5a642,     
      metalness: 1,
      roughnessMap: Loader.loadTexture('res/bluecloud_dn.jpg')
    });
    reflectionMaterial.roughnessMap.wrapS = reflectionMaterial.roughnessMap.wrapT = THREE.RepeatWrapping;
    reflectionMaterial.roughnessMap.repeat.set(1, 50);
    this.reflectionMaterial = reflectionMaterial;
    var tube = new THREE.Mesh(tubeGeometry, shaderMaterial);
    //tube.add(new THREE.Mesh(tubeGeometryInner, refractionMaterial));
    this.tubes.push(tube);
    this.mainObject.add(tube);
    var light = new THREE.PointLight();
    light.intensity = 0.00002;
    this.mainObject.add(light);
    this.lights.push(light);
    var lightCenter = new THREE.Mesh(lightCenterGeometry, new THREE.MeshBasicMaterial());
    this.mainObject.add(lightCenter);
    this.lightCenters.push(lightCenter);
  }
  this.scene.add(this.mainObject);

  var cogGeometry = new THREE.CylinderGeometry(125, 125, 5, 64, 1);
  for(var j = 0; j < cogGeometry.vertices.length; j++) {
    var vertex = cogGeometry.vertices[j];
    if((j % 4) < 2) {
      vertex.multiplyScalar(.92);
    }
  }
  this.disc = new THREE.Mesh(cogGeometry, null);
  this.scene.add(this.disc);

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.camera.position.x = 0;
  this.camera.position.y = 0;
  this.camera.position.z = 200;
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.renderPass.clear = true;
  var bloomPass = new THREE.BloomPass(2);
  this.glowEffectComposer = new THREE.EffectComposer(demo.renderer);
  this.glowEffectComposer.addPass(this.renderPass);
  this.glowEffectComposer.addPass(bloomPass);
  this.finalEffectComposer = new THREE.EffectComposer(demo.renderer);
  this.addPass = new THREE.ShaderPass(SHADERS.add);
  this.finalEffectComposer.addPass(this.renderPass);
}

spinwiresLayer.prototype.getEffectComposerPass = function() {
  return this.addPass;
};

spinwiresLayer.prototype.start = function() {
};

spinwiresLayer.prototype.end = function() {
};

spinwiresLayer.prototype.resize = function() {
  this.glowEffectComposer.setSize(16 * GU, 9 * GU);
  this.finalEffectComposer.setSize(16 * GU, 9 * GU);
};

spinwiresLayer.prototype.update = function(frame, relativeFrame) {
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
  this.disc.rotation.y = speed * relativeFrame / 100;
  this.rod.rotation.y = speed * relativeFrame / 100;
  this.lightCentersActive = relativeFrame > 210;

  //this.mainObject.scale.y = smoothstep(0, 1, (relativeFrame - 50) / 100);
  //this.mainObject.position.y = smoothstep(-25, 0, (relativeFrame - 50) / 100);
  //

  this.mainObject.position.y = this.audioAnalysis.getValue(frame);
  this.disc.position.y = this.audioAnalysis.getValue(frame) - 25;
  this.rod.position.y = this.audioAnalysis.getValue(frame) - 120;

  var cameraStep = (relativeFrame + 300) / 600;
  this.camera.position.x = smoothstep(450, 0, cameraStep);
  this.camera.position.y = smoothstep(50, 0, cameraStep);
  this.camera.position.z = smoothstep(450, 200, cameraStep);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  if(frame > 5537 - 300) {
    var cameraStep = (frame - 5537 + 300) / 300;
    this.camera.position.x = smoothstep(0, -100, cameraStep);
    this.camera.position.y = smoothstep(0, 0, cameraStep);
    this.camera.position.z = smoothstep(200, 100, cameraStep);
    this.camera.lookAt(new THREE.Vector3(0, 0, 100));
  }
  /*
  this.camera.position.x = 450 * Math.sin(relativeFrame / 2000);
  this.camera.position.z = 450 * Math.cos(relativeFrame / 2000);
  this.camera.position.y = 20;
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  */
  for(var i = 0; i < this.lights.length; i++) {
    var light = this.lights[i]; 
    var lightCenter = this.lightCenters[i]; 
    light.position.copy(this.curves[i].getPoint((2.75 - speed * relativeFrame / 100 / Math.PI / 2) % 1));
    lightCenter.position.copy(light.position);
  }

  for(var i = 0; i < this.tubes.length; i++) {
    var tube = this.tubes[i];
    for(var j = 0; j < tube.geometry.vertices.length; j++) {
      var step = clamp(0, (-j + relativeFrame * 100 - i * tube.geometry.vertices.length), 1);
      var vertex = tube.geometry.vertices[j];
      var center = tube.geometry.centers[j];
      var radius = tube.geometry.radii[j];
      var index = tube.geometry.indexes[j];
      vertex.x = center.x + radius.x * step;
      vertex.y = center.y + radius.y * step;
      vertex.z = center.z + radius.z * step;
    }
    tube.geometry.verticesNeedUpdate = true;
  }
};

spinwiresLayer.prototype.render = function(renderer, interpolation) {
  this.rigMaterialsForRenderPass();
  this.scene.remove(this.mainObject);
  this.scene.add(this.disc);
  this.reflectionCamera.updateCubeMap(renderer, this.scene);
  this.disc.material = new THREE.MeshStandardMaterial({
    color: 0xb5a642,
    metalness: 0.8
  });
  this.refractionCamera.updateCubeMap(renderer, this.scene);
  this.scene.add(this.mainObject);
  this.rigMaterialsForGlowPass();
  this.glowEffectComposer.render();
  this.rigMaterialsForRenderPass();
  this.finalEffectComposer.render();
  this.addPass.uniforms.tA.value = this.finalEffectComposer.renderTarget2;
  this.addPass.uniforms.tB.value = this.glowEffectComposer.renderTarget2;
};

spinwiresLayer.prototype.rigMaterialsForGlowPass = function() {
  for(var i = 0; i < this.tubes.length; i++) {
    this.tubes[i].material = this.shaderMaterial;
    this.mainObject.remove(this.lights[i]);
    if(this.lightCentersActive) {
      this.mainObject.add(this.lightCenters[i]);
    }
  }
  this.barLightHolder.material = this.blackoutMaterial;
  this.disc.material = this.shaderMaterial;
  this.scene.remove(this.skyBox);
  this.floor.material = this.blackoutMaterial;
  this.rod.material = this.blackoutMaterial;
  this.scene.add(this.godray);
}

spinwiresLayer.prototype.rigMaterialsForRenderPass = function() {
  for(var i = 0; i < this.tubes.length; i++) {
    this.tubes[i].material = this.refractionMaterial;
    this.mainObject.add(this.lights[i]);
    this.mainObject.remove(this.lightCenters[i]);
  }
  this.scene.remove(this.godray);
  this.barLightHolder.material = this.barLightHolderRenderMaterial;
  this.disc.material = this.reflectionMaterial;
  this.scene.add(this.skyBox);
  this.floor.material = this.floorMaterial;
  this.rod.material = this.reflectionMaterial;
}