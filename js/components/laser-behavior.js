AFRAME.registerComponent('laser-behavior', {
  schema: {
    speed: { default: 1 }
  },

  init: function () {
    this.el.sceneEl.addBehavior(this);
  },

  tick: function () {
    var object3D = this.el.object3D;
    object3D.translateY(this.data.speed);
  }
});
