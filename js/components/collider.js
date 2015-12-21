AFRAME.registerComponent('collider', {
  init: function() {
    this.el.sceneEl.addBehavior(this);
  },

  update: function () {
    var sceneEl = this.el.sceneEl;
    var object3D = this.el.object3D;
    var originPoint = object3D.position.clone();
    for (var vertexIndex = 0; vertexIndex < object3D.geometry.vertices.length; vertexIndex++) {
      var localVertex = object3D.geometry.vertices[vertexIndex].clone();
      var globalVertex = localVertex.applyMatrix4( object3D.matrix );
      var directionVector = globalVertex.sub( object3D.position );

      var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
      var collisionResults = ray.intersectObjects( sceneEl.object3D.children );
      collisionResults.forEach(hit);
    }
    function hit(collision) {
      if (collision.object === object3D) {
        return;
      }
      if (collision.distance < directionVector.length()) {
        collision.object.el.emit('hit');
      }
    }
  }
});