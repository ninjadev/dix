/**
 * @constructor
 */
function audioAnalysisSanitizer(sound, feature, decay) {
  this.sound = sound;
  this.feature = feature;
  this.decay = decay;
  this.currentValue = 0;
}

audioAnalysisSanitizer.prototype.getValue = function(frame) {
  var value = window.audioAnalysis[this.sound][this.feature][frame];
  this.currentValue -= this.decay;
  if (value > this.currentValue) {
    this.currentValue = value;
  }
  return this.currentValue;
};
