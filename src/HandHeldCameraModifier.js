/**
 * @constructor
 */
function HandHeldCameraModifier(scale, seed) {
  this.scale = scale;
  this.position = new THREE.Vector3(0, 0, 0);
  this.velocity = new THREE.Vector3(0, 0, 0);
  this.acceleration = new THREE.Vector3(0, 0, 0);
  this.rotation = new THREE.Vector3(0, 0, 0);
  this.angularVelocity = new THREE.Vector3(0, 0, 0);
  this.angularAcceleration = new THREE.Vector3(0, 0, 0);
  this.random = new Random(seed || 0);
}

HandHeldCameraModifier.prototype.update = function(camera) {
  this.velocity.add(this.position.clone().multiplyScalar(-1 / 8));
  this.acceleration.x += (this.random() - 0.5) * this.scale;
  this.acceleration.y += (this.random() - 0.5) * this.scale;
  this.acceleration.z += (this.random() - 0.5) * this.scale;
  this.acceleration.multiplyScalar(0.9);
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  camera.position.add(this.position);

  this.angularVelocity.add(this.rotation.clone().multiplyScalar(-1 / 8));
  this.angularAcceleration.x += (this.random() - 0.5) * this.scale;
  this.angularAcceleration.y += (this.random() - 0.5) * this.scale;
  this.angularAcceleration.z += (this.random() - 0.5) * this.scale;
  this.angularAcceleration.multiplyScalar(0.9);
  this.angularVelocity.add(this.angularAcceleration);
  this.rotation.add(this.angularVelocity);
  camera.rotation.x += this.rotation.x;
  camera.rotation.y += this.rotation.y;
  camera.rotation.z += this.rotation.z;
};
