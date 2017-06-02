AFRAME.registerComponent('laser-behavior', {
  schema: {
    speed: { default: 1 }
  },

  init: function () {
  },

  update: function () {
    var object3D = this.el.object3D;
    object3D.translateY(this.data.speed);
  }
});
