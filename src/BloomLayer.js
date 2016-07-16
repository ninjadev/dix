/*
 * @constructor
 */
function BloomLayer(layer) {
  this.config = layer.config;
  this.amount = this.config.amount;
  this.noStabs = !!this.config.noStabs;
  this.shaderPass = new THREE.BloomPass(this.amount, 16, 160, 512);
  this.stab = 0;
}

BloomLayer.prototype.update = function(frame) {

  this.stab *= 0.96;
  if(this.stab < 0.1) {
    this.stab = 0;
  }
  if(BEAN < 288) {
  } else if(BEAN < 672) {
    if(BEAT && BEAN % 12 == 6) {
      this.stab += 1;
    }
  } else if(BEAN < 864) {
    if(BEAT && BEAN % 12 == 0) {
      this.stab += 1;
    }
  } else if(BEAN < 1056) {
    if(BEAT && BEAN % 24 == 12) {
      this.stab += 1;
    }
  } else if(BEAN < 1248) {
    if(BEAT && BEAN % 12 == 0) {
      this.stab += 1;
    }
  } else if(BEAN < 1632) {
    this.stab *= 1.03;
  } else if(BEAN < 2016) {
    if(BEAT && BEAN % 12 == 0) {
      this.stab += 1;
    }
    if(BEAT && BEAN % 24 == 12) {
      this.stab += 3;
    }
  }
  if(BEAT && BEAN == 96) {
    this.stab += 10;
  }
  if(BEAT && BEAN == 288) {
    this.stab += 5;
  }
  if(BEAT && BEAN == 864) {
    this.stab += 5;
  }
  if(BEAT && BEAN == 1248) {
    this.stab += 5;
  }
  if(BEAT && BEAN == 1440) {
    this.stab += 1;
  }
  if(BEAT && BEAN == 2016) {
    this.stab += 5;
  }
  var multiplier = this.noStabs ? 1 : this.stab;
  this.shaderPass.copyUniforms.opacity.value = this.amount * multiplier;
};

BloomLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
