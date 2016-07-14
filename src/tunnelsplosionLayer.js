/*
 * @constructor
 */
function tunnelsplosionLayer(layer, demo) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.lightDistance = 0;
  this.distanceOffset = 0;

  this.camera = new THREE.PerspectiveCamera(35, 16 / 9, 1, 10000);
  this.cameraOffset = new THREE.Vector3(0, 0, 0);
  this.cameraDistance = 50;
  this.cameraZRotation = 0;

  this.snareAnalysis = new audioAnalysisSanitizer('snare.wav', 'spectral_energy', 0.1);
  this.kickAnalysis = new audioAnalysisSanitizer('kick.wav', 'spectral_energy', 1);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.renderPass.clear = true;
  var bloomPass = new THREE.BloomPass(8, 25 / 2, 4 / 2, 1024);
  this.glowEffectComposer = new THREE.EffectComposer(demo.renderer);
  this.glowEffectComposer.addPass(this.renderPass);
  this.glowEffectComposer.addPass(bloomPass);
  this.finalEffectComposer = new THREE.EffectComposer(demo.renderer);
  this.addPass = new THREE.ShaderPass(SHADERS.add);
  this.finalEffectComposer.addPass(this.renderPass);
  this.ssaoPass = new THREE.ShaderPass(THREE.SSAOShader);
  this.ssaoPass.needsSwap = true;
  this.finalEffectComposer.addPass(this.ssaoPass);

  this.depthMaterial = new THREE.MeshDepthMaterial();
  this.depthMaterial.depthPacking = THREE.RGBADepthPacking;
  this.depthMaterial.blending = THREE.NoBlending;
  this.depthRenderTarget = new THREE.WebGLRenderTarget(16 * GU, 9 * GU, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter
  });

  this.ssaoPass.uniforms.tDepth.value = this.depthRenderTarget.texture;
  this.ssaoPass.uniforms.size.value.set(16 * GU, 9 * GU);
  this.ssaoPass.uniforms.cameraNear.value = this.camera.near;
  this.ssaoPass.uniforms.cameraFar.value = this.camera.far;
  this.ssaoPass.uniforms.onlyAO.value = false;
  this.ssaoPass.uniforms.aoClamp.value = 0.3;
  this.ssaoPass.uniforms.lumInfluence.value = 0.5;

  this.currentColorIndex = 0;
  this.colors = [
    new THREE.Color(96./255., 87./255., 106./255.),
    new THREE.Color(133./255., 166./255., 135./255.),
    new THREE.Color(175./255., 218./255., 139./255.),
    new THREE.Color(243./255., 242./255., 124./255.),
    new THREE.Color(221./255., 176./255., 109./255.)
  ];

  this.ambientLight = new THREE.AmbientLight(0xffffff)
  this.ambientLight.intensity = 1;
  this.scene.add(this.ambientLight);

  var wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  });

  this.pointLight = new THREE.PointLight();
  this.pointLightWhite = new THREE.PointLight();
  this.pointLight.decay = 2;
  this.pointLightWhite.decay = 2;
  this.pointLight.intensity = 0;
  this.pointLightWhite.intensity = 1;
  this.scene.add(this.pointLight);
  this.scene.add(this.pointLightWhite);

  this.curve = new THREE.Curves.KnotCurve();
  this.blackoutMaterial = new THREE.MeshBasicMaterial({
    color: 0,
    side: THREE.DoubleSide
  });
  this.tunnelRenderMaterial = new THREE.MeshStandardMaterial({
    color: 0xb5a642,     
    metalness: 1,
    shading: THREE.FlatShading,
    roughness: 0.2,
    side: THREE.DoubleSide
  });
  this.tunnelGlowMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  this.tunnel = new THREE.Mesh(
    new THREE.TubeGeometryEx(this.curve, 200, 55, 64),
    this.tunnelRenderMaterial);
  /*
  this.tunnelRenderMaterial.map.repeat.set(256, 8);
  this.tunnelRenderMaterial.map.wrapS = this.tunnelRenderMaterial.map.wrapT = THREE.RepeatWrapping;
  this.tunnelRenderMaterial.bumpMap.repeat.set(256, 8);
  this.tunnelRenderMaterial.bumpMap.wrapS = this.tunnelRenderMaterial.bumpMap.wrapT = THREE.RepeatWrapping;
  this.tunnelRenderMaterial.bumpScale = 0.1;
  this.tunnelGlowMaterial.map.repeat.set(256, 8);
  this.tunnelGlowMaterial.map.wrapS = this.tunnelGlowMaterial.map.wrapT = THREE.RepeatWrapping;
  */
  this.scene.add(this.tunnel);
  this.ball = new THREE.Object3D();
  this.colorBallRenderMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    shading: THREE.FlatShading
  });
  this.colorBall = new THREE.Mesh(new THREE.TetrahedronGeometry(10, 2),
      this.colorBallRenderMaterial);
  this.wireframeBallRenderMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  });
  this.wireframeBallGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  });
  this.wireframeBall = new THREE.Mesh(new THREE.TetrahedronGeometry(10, 2),
      this.wireframeBallRenderMaterial);
  this.wireframeBall.scale.set(1.1, 1.1, 1.1);
  this.ball.add(this.colorBall)
  this.ball.add(this.wireframeBall);

  this.particles = [];
  this.particles.liveCount = 0;
  this.particleContainer = new THREE.Object3D();
  this.scene.add(this.particleContainer);
  for(var i = 0; i < 10000; i++) {
    var particle = this.colorBall.clone();
    this.particles.push(particle);
  }

  this.emitters = [];
  this.emitters.liveCount = 0;
  for(var i = 0; i < 100; i++) {
    var emitter = new THREE.Object3D();
    emitter.speed = new THREE.Vector3(0, 0, 0);
    emitter.life = 0;
    this.emitters.push(emitter);
  }

  this.scene.add(this.ball);

  this.camera.position.z = 200;
}

tunnelsplosionLayer.prototype.explode = function() {
  var origo = new THREE.Vector3(0, 0, 0);
  this.particleContainer.rotation.copy(this.ball.rotation);
  this.particleContainer.position.copy(this.ball.position);
  this.spawnEmitter(new THREE.Vector3(10, 0, 0), new THREE.Vector3(4, 0, 0), 12);
  this.spawnEmitter(new THREE.Vector3(0, 10, 0), new THREE.Vector3(0, 4, 0), 12);
  this.spawnEmitter(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, 4), 12);
  this.spawnEmitter(new THREE.Vector3(-10, 0, 0), new THREE.Vector3(-4, 0, 0), 12);
  this.spawnEmitter(new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, -4, 0), 12);
  this.spawnEmitter(new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, -4), 12);
}

tunnelsplosionLayer.prototype.getEffectComposerPass = function() {
  return this.addPass;
};

tunnelsplosionLayer.prototype.start = function() {
};

tunnelsplosionLayer.prototype.end = function() {
};

tunnelsplosionLayer.prototype.resize = function() {
  this.glowEffectComposer.setSize(16 * GU, 9 * GU);
  this.finalEffectComposer.setSize(16 * GU, 9 * GU);
  this.ssaoPass.uniforms.size.value.set(16 * GU, 9 * GU);
  this.depthRenderTarget.setSize(16 * GU, 9 * GU);
};

tunnelsplosionLayer.prototype.update = function(frame, relativeFrame) {

  relativeFrame -= this.kickAnalysis.getValue(frame);
  relativeFrame += 1 * this.snareAnalysis.getValue(frame);

  for(var j = 0; j < this.tunnel.geometry.vertices.length; j++) {
    var vertex = this.tunnel.geometry.vertices[j];
    var center = this.tunnel.geometry.centers[j];
    var radius = this.tunnel.geometry.radii[j];
    var index = this.tunnel.geometry.indexes[j];
    var radiusScaler = 1;
    if(j % 4 < 2) {
      radiusScaler = 0.92;
    }
    vertex.x = center.x + radiusScaler * radius.x * (1 + 0.2 * Math.cos(relativeFrame / 20) * Math.sin(relativeFrame / 20 + 2 * j / 64 * Math.PI * 2));
    vertex.y = center.y + radiusScaler * radius.y * (1 + 0.2 * Math.sin(relativeFrame / 20 + 2 * j / 64 * Math.PI * 2));
    vertex.z = center.z + radiusScaler * radius.z * (1 + 0.2 * Math.sin(relativeFrame / 20 + 2 * j / 64 * Math.PI * 2));
  }
  this.tunnel.geometry.verticesNeedUpdate = true;


  if(frame < 6645) {
    if(BEAN % 48 == 9) {
      this.lightDistance = -500;
    }
    if(relativeFrame == 0 || BEAT && BEAN % 48 == 36) {
      this.ball.scale.set(3, 3, 3);
      this.pointLight.intensity = 1;
      this.cameraOffset.set(
          Math.random() * 40,
          Math.random() * 20,
          Math.random() * 40);
      this.cameraDistance = 10 + Math.pow(Math.random(), 2) * 80;
      this.cameraZRotation = 0.7 + Math.random() - 0.5;
      this.cameraZRotation = Math.random() * Math.PI * 2;
      this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
      this.lightDistance = 0;
      this.distanceOffset = 15000 * Math.random();
    }
  }

  this.ball.rotation.x = Math.sin(frame / 27);
  this.ball.rotation.y = Math.cos(frame / 37);
  this.pointLight.color.copy(this.colors[this.currentColorIndex]);
  this.colorBall.material.color.copy(this.colors[this.currentColorIndex]);
  this.tunnelGlowMaterial.color.copy(
      this.colors[this.currentColorIndex].clone().multiplyScalar(2 * Math.pow(this.pointLight.intensity, 3)));
  this.tunnelRenderMaterial.color.copy(this.colors[this.currentColorIndex]);
  /*
  this.ball.position.y = relativeFrame;
  */
  this.lightDistance += 8;
  if(frame >= 6645) {
    this.lightDistance = 0;
    this.cameraDistance = -10;
  }
  this.ball.position.copy(this.curve.getPoint((relativeFrame + this.distanceOffset + this.cameraDistance * 4) / 20000));
  this.pointLight.position.copy(this.ball.position);
  this.pointLight.position.copy(this.curve.getPoint((relativeFrame + this.distanceOffset + this.cameraDistance * 4 + this.lightDistance) / 20000));
  this.ball.position.copy(this.pointLight.position);
  this.camera.position.copy(this.curve.getPoint((relativeFrame + this.distanceOffset) / 20000).add(this.cameraOffset));
  this.camera.lookAt(this.ball.position);
  this.camera.rotation.z = this.cameraZRotation;
  this.pointLightWhite.position.copy(this.camera.position);
  /*
  this.ball.position.x = Math.cos(frame / 100) * 100;
  this.ball.position.y = Math.sin(frame / 100) * 100;
  this.camera.position.x = Math.cos(frame / 100) * 100;
  this.camera.position.y = Math.sin(frame / 100) * 100;
  */

  if(frame < 6645) {
    this.spawnParticle({
      position: this.curve.getPoint((relativeFrame + this.distanceOffset + this.cameraDistance * 3 + this.lightDistance) / 20000)
    });
  } else {
    this.spawnParticle({
      position: this.curve.getPoint((relativeFrame + this.distanceOffset + this.cameraDistance * 6 + this.lightDistance) / 20000)
    });
  }

  for(var i = 0; i < this.particles.liveCount; i++) {
    var particle = this.particles[i];
    if(particle.life <= 0.01) {
      this.particles[i] = this.particles[--this.particles.liveCount];
      this.particles[this.particles.liveCount] = particle;
      this.particleContainer.remove(particle);
      continue;
    }
    particle.life *= 0.95;
    particle.scale.x = particle.life;
    particle.scale.y = particle.life;
    particle.scale.z = particle.life;
  }

  for(var i = 0; i < this.emitters.liveCount; i++) {
    var emitter = this.emitters[i];
    if(emitter.life == 0) {
      this.emitters[i] = this.emitters[--this.emitters.liveCount];
      this.emitters[this.emitters.liveCount] = emitter;
      continue;
    }
    emitter.life--;
    emitter.position.x += emitter.speed.x;
    emitter.position.y += emitter.speed.y;
    emitter.position.z += emitter.speed.z;
    this.spawnParticle(emitter);
  }

  this.pointLight.intensity *= 0.99;
  this.pointLightWhite.intensity *= 0.99;
  if(BEAT && BEAN % 48 == 0) {
    this.explode();
  }
  if(BEAT && BEAN % 48 == 9) {
    this.explode();
  }
  if(BEAT && BEAN % 48 == 18) {
    this.explode();
  }
  this.ball.scale.x = lerp(this.ball.scale.x, 1, 0.05);
  this.ball.scale.y = lerp(this.ball.scale.y, 1, 0.05);
  this.ball.scale.z = lerp(this.ball.scale.z, 1, 0.05);
};

tunnelsplosionLayer.prototype.rigMaterialsForGlowPass = function() {
  this.tunnel.material = this.tunnelGlowMaterial;
  this.colorBall.material = this.blackoutMaterial;
  //this.wireframeBall.material = this.wireframeBallGlowMaterial;
}

tunnelsplosionLayer.prototype.rigMaterialsForRenderPass = function() {
  this.tunnel.material = this.tunnelRenderMaterial;
  this.colorBall.material = this.colorBallRenderMaterial;
  this.wireframeBall.material = this.wireframeBallRenderMaterial;
}

tunnelsplosionLayer.prototype.render = function(renderer, interpolation) {
  this.rigMaterialsForGlowPass();
  this.glowEffectComposer.render();
  this.rigMaterialsForRenderPass();
  this.finalEffectComposer.render();
  this.addPass.uniforms.tA.value = this.finalEffectComposer.renderTarget2;
  this.addPass.uniforms.tB.value = this.glowEffectComposer.renderTarget2;
};

tunnelsplosionLayer.prototype.spawnParticle = function(emitter) {
  var particle = this.particles[this.particles.liveCount++];
  particle.life = 1;
  particle.position.x = emitter.position.x + (Math.random() - 0.5) * 2;
  particle.position.y = emitter.position.y + (Math.random() - 0.5) * 2;
  particle.position.z = emitter.position.z + (Math.random() - 0.5) * 2;
  particle.rotation.x = Math.random() * Math.PI * 2;
  particle.rotation.y = Math.random() * Math.PI * 2;
  particle.rotation.z = Math.random() * Math.PI * 2;
  this.particleContainer.add(particle);
}

tunnelsplosionLayer.prototype.spawnEmitter = function(position, speed, life) {
  var emitter = this.emitters[this.emitters.liveCount++];
  emitter.life = life;
  emitter.position.copy(position);
  emitter.speed.copy(speed);
}
