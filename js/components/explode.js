AFRAME.registerComponent('explode', {
  schema: { on: { default: ''} },

  update: function (previousData) {
    var el = this.el;
    var explode = this.handler = this.explode.bind(this);
    if (previousData) {
      el.removeEventListener(previousData.on, explode);
    }
    el.addEventListener(this.data.on, explode);
  },

  explode: function () {
    var object3D = this.el.getObject3D('mesh');
    var scene = this.el.sceneEl.object3D;
    var duration = 8000;

    // explode geometry into objects
    var pieces = explode(object3D.geometry, object3D.material);

    object3D.material.visible = false;

    // animate objects
    for ( var i = 0; i < pieces.children.length; i ++ ) {

      var object = pieces.children[ i ];

      object.geometry.computeFaceNormals();
      var normal = object.geometry.faces[0].normal.clone();
      var targetPosition = object.position.clone().add(normal.multiplyScalar(300));
      //removeBoxFromList( object3D );
      new TWEEN.Tween( object.position )
        .to( targetPosition, duration )
        .onComplete( deleteBox )
        .start();

      object.material.opacity = 0;
      new TWEEN.Tween( object.material )
        .to( { opacity: 1 }, duration )
        .start();

      var rotation = 2 * Math.PI;
      var targetRotation = { x: rotation, y: rotation, z:rotation };
      new TWEEN.Tween( object.rotation )
        .to( targetRotation, duration )
        .start();

    }

    function deleteBox() {
      object3D.remove( pieces )
      scene.remove( object3D );
    }

    object3D.add(pieces);
    this.el.removeEventListener(this.data.on, this.handler);

    function explode( geometry, material ) {
      var pieces = new THREE.Group();
      var material = material.clone();
      material.side = THREE.DoubleSide;

      for (var i = 0; i < geometry.faces.length; i ++) {
        var face = geometry.faces[ i ];

        var vertexA = geometry.vertices[ face.a ].clone();
        var vertexB = geometry.vertices[ face.b ].clone();
        var vertexC = geometry.vertices[ face.c ].clone();

        var geometry2 = new THREE.Geometry();
        geometry2.vertices.push( vertexA, vertexB, vertexC );
        geometry2.faces.push( new THREE.Face3( 0, 1, 2 ) );

        var mesh = new THREE.Mesh( geometry2, material );
        mesh.position.sub( geometry2.center() );
        pieces.add( mesh );
      }
      //sort the pieces
      pieces.children.sort( function ( a, b ) {
        return a.position.z - b.position.z;
        //return a.position.x - b.position.x;     // sort x
        //return b.position.y - a.position.y;   // sort y
      } );
      pieces.rotation.set( 0, 0, 0 )
      return pieces;
    }

    function removeBoxFromList( box ) {
      var objects = scene.children;
      for (var i = 0; i < objects.length; i++) {
        if (objects[i] === box) {
          objects.splice(i, 1);
          return;
        }
      }
    }

  }
});