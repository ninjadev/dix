/**
 * @constructor
 */
function cubegridLayer(layer, demo) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.snareAnalysis = new audioAnalysisSanitizer('snare.wav', 'spectral_energy', 5);
  this.kickAnalysis = new audioAnalysisSanitizer('kick.wav', 'spectral_energy', 0.5);

  this.pointLight = new THREE.PointLight();
  this.pointLight.position.y = 200;
  this.scene.add(this.pointLight);

  this.scene.add(new THREE.AmbientLight(0x404040));

  this.cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  this.cubeRenderMaterial = new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0
  });
  this.blackoutMaterial = new THREE.MeshBasicMaterial({color: 0});
  this.grid = [];
  this.gridSize = 8;
  for(var x = 0; x < this.gridSize; x++) {
    this.grid[x] = [];
    for(var y = 0; y < this.gridSize; y++) {
      this.grid[x][y] = [];
      for(var z = 0; z < this.gridSize; z++) {
        var cube = new THREE.Mesh(this.cubeGeometry, this.cubeRenderMaterial);
        cube.position.x = x - this.gridSize / 2 - 0.5;
        cube.position.y = y - this.gridSize / 2 - 0.5;
        cube.position.z = z - this.gridSize / 2 - 0.5;
        cube.position.multiplyScalar(3);
        cube.material = new THREE.MeshStandardMaterial({});
        this.grid[x][y][z] = cube;
        this.scene.add(cube);
      }
    }
  }

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.cameraLight = new THREE.PointLight();
  this.scene.add(this.cameraLight);

  this.handHeldCameraModifier = new HandHeldCameraModifier(0.00001);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.renderPass.clear = true;
  this.ssaoPass = new THREE.ShaderPass(THREE.SSAOShader);
  this.ssaoPass.needsSwap = true;
  this.bloomPass = new THREE.BloomPass(2);
  this.glowEffectComposer = new THREE.EffectComposer(demo.renderer);
  this.glowEffectComposer.addPass(this.renderPass);
  this.glowEffectComposer.addPass(this.bloomPass);
  this.finalEffectComposer = new THREE.EffectComposer(demo.renderer);
  this.finalEffectComposer.addPass(this.renderPass);
  this.addPass = new THREE.ShaderPass(SHADERS.add);
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

  var skyBox = new THREE.Mesh(
    new THREE.BoxGeometry(300, 300, 300),
    new THREE.MeshStandardMaterial({
      color: 0x606060,
      metalness: 0,
      roughness: 1,
      side: THREE.DoubleSide  
    }));
  this.scene.add(skyBox);
  this.skyBox = skyBox;
}

cubegridLayer.prototype.getEffectComposerPass = function() {
  return this.addPass;
};

cubegridLayer.prototype.start = function() {
};

cubegridLayer.prototype.end = function() {
};

cubegridLayer.prototype.resize = function() {
  this.depthRenderTarget.setSize(16 * GU, 9 * GU);
  this.ssaoPass.uniforms.size.value.set(16 * GU, 9 * GU);
  this.glowEffectComposer.setSize(16 * GU, 9 * GU);
  this.finalEffectComposer.setSize(16 * GU, 9 * GU);
};

cubegridLayer.prototype.update = function(frame, relativeFrame) {
  var time = relativeFrame / 2;
  var cameraTime = time + this.kickAnalysis.getValue(frame) - 2 * this.snareAnalysis.getValue(frame);

  this.bloomPass.copyUniforms.opacity.value = this.kickAnalysis.getValue(frame);

  this.camera.position.x = Math.sin(cameraTime / 40) * 60;
  this.camera.position.y = 20;
  this.camera.position.z = Math.cos(cameraTime / 40) * 60;
  this.cameraLight.position.copy(this.camera.position);
  this.camera.lookAt(new THREE.Vector3(0, -5, 0));
  this.handHeldCameraModifier.update(this.camera);

  if(BEAN < 768) {
    for(var x = 0; x < this.gridSize; x++) {
      for(var y = 0; y < this.gridSize; y++) {
        for(var z = 0; z < this.gridSize; z++) {
          var cube = this.grid[x][y][z];
          var scale = Math.sqrt(0.5 +
            0.5 * (Math.sin(x / 7 + Math.PI * 2 * time / 40) +
            Math.cos(y / 4 + Math.PI * 2 * time / 37) +
            Math.sin(0.1 * Math.cos(x / 3) / 4 + Math.PI * 2 * time / 50) +
            Math.sin(0.4 * z / 4 + Math.PI * 2 * time / 54)));
          scale += 0.1 * this.kickAnalysis.getValue(frame);
          var r = lerp(0xf4, 0xff, scale) / 0xff;
          var g = lerp(0x57, 0xc9, scale) / 0xff;
          var b = lerp(0xad, 0x6b, scale) / 0xff;
          cube.material.color.setRGB(r, g, b);
          cube.scale.set(scale, scale, scale);
        }
      }
    }
  } else {
    for(var x = 0; x < this.gridSize; x++) {
      for(var y = 0; y < this.gridSize; y++) {
        for(var z = 0; z < this.gridSize; z++) {
          var cube = this.grid[x][y][z];
          var position = 10 * Math.sin(time / 10);
          if(BEAN  >= 816) {
            position = ((time) % (this.gridSize * 2)) - this.gridSize;
          }
          var dx = x - this.gridSize / 2 + position;
          var dy = y - this.gridSize / 2;
          var dz = z - this.gridSize / 2;
          var scale = 1;
          var size = 30 + 30 * Math.sin(frame / 10);
          var check = dx * dx + dy * dy + dz * dz;
          if(BEAN >= 816) {
            scale = smoothstep(1, 0, size / check);
          } else {
            scale = smoothstep(0, 1, size / check);
          }
          //scale += 0.01 * this.kickAnalysis.getValue(frame);
          var r = lerp(0xf4, 0xff, scale) / 0xff;
          var g = lerp(0x57, 0xc9, scale) / 0xff;
          var b = lerp(0xad, 0x6b, scale) / 0xff;
          cube.material.color.setRGB(r, g, b);
          cube.scale.set(scale, scale, scale);
        }
      }
    }
  }
};

cubegridLayer.prototype.render = function(renderer, interpolation) {
  this.scene.overrideMaterial = this.depthMaterial;
  renderer.render(this.scene, this.camera, this.depthRenderTarget, true);
  this.scene.overrideMaterial = null;
  this.rigMaterialsForGlowPass();
  this.glowEffectComposer.render();
  this.rigMaterialsForRenderPass();
  this.finalEffectComposer.render();
  this.addPass.uniforms.tA.value = this.finalEffectComposer.renderTarget1;
  this.addPass.uniforms.tB.value = this.glowEffectComposer.renderTarget2;
};

cubegridLayer.prototype.rigMaterialsForGlowPass = function() {
  this.scene.remove(this.skyBox);
}

cubegridLayer.prototype.rigMaterialsForRenderPass = function() {
  this.scene.add(this.skyBox);
}
