/**
 * @constructor
 */
function cubegridLayer(layer, demo) {
  var that = this;

  var CubeGrid = class CubeGrid {
    constructor(nX, nZ, cubeWidth, separation, cubeHeight = 15) {
      let colors = [new THREE.Color("rgb(58, 85, 94)"),
                    new THREE.Color("rgb(77, 105, 115)"),
                    new THREE.Color("rgb(40, 62, 69)")];
      this.mesh = new THREE.Object3D();
      this.cubes = new THREE.Object3D();
      this.nX = nX;
      this.nZ = nZ;
      this.cubeHeight = cubeHeight;
      this.cubeWidth = cubeWidth;
      this.separation = separation;

      let rr = function rr(max, min) {
        return Math.random() * (max - min) + min;
      }

      for (var x=-this.nX; x <= this.nX; x++) {
        for (var z=-this.nZ; z <= this.nZ; z++) {
          let dx = Math.abs(x / (this.nX * 2));
          let dz = Math.abs(z / (this.nZ * 2));

          let a = 0.25 * Math.sqrt(3.0);
          let inside = (dz <= a) && (a*dx + 0.25*dz <= 0.5*a);

          if (!inside) {
            continue;
          }

          var color = colors[Math.floor(Math.random()*3)];
          var cube = new THREE.Mesh(
              new THREE.BoxGeometry(
                cubeWidth * Math.pow(rr(0.1, 1.0), 0.5),
                this.cubeHeight,
                cubeWidth * Math.pow(rr(0.1, 1.0), 0.5)),
              new THREE.MeshPhongMaterial({
                color: color}));

          cube.position.set(
              x * (this.cubeWidth + this.separation) + Math.random() * this.separation,
              0,
              z * (this.cubeWidth + this.separation) + Math.random() * this.separation);
          this.cubes.add(cube);
        }
      }

      this.mesh.add(this.cubes);
    }

    update(frame, relativeFrame) {
      for (let index in this.cubes.children) {
        let cube = this.cubes.children[index];
        let x = index % (2 * this.nX + 1);
        let z = index / (2 * this.nZ + 1);
        let offset = x + z + Math.sin(index) * 2;
        cube.scale.y = 1 + Math.abs(Math.sin((relativeFrame + offset) / 60));
        cube.scale.x = 1.0 + Math.cos((relativeFrame + offset) / 25) / 4;
        cube.scale.z = 1.0 + Math.sin((relativeFrame + offset) / 50) / 4;
      }
    }
  }

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

  this.cg = new CubeGrid(18, 18, 15, 1);
  this.cg.mesh.position.y = -70;
  this.scene.add(this.cg.mesh);
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

  this.bloomPass.copyUniforms.opacity.value = this.kickAnalysis.getValue(frame);

  this.camera.position.x = Math.sin(time / 80) * 60;
  this.camera.position.y = 20;
  this.camera.position.z = Math.cos(time / 80) * 60;
  this.cameraLight.position.copy(this.camera.position);
  this.camera.lookAt(new THREE.Vector3(0, -5, 0));
  this.handHeldCameraModifier.update(this.camera);

  this.cg.update(frame, relativeFrame);

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
          scale = Math.max(scale, 0.01);
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
          scale = Math.max(scale, 0.01);

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
  this.scene.remove(this.cg.mesh);
}

cubegridLayer.prototype.rigMaterialsForRenderPass = function() {
  this.scene.add(this.cg.mesh)
}
