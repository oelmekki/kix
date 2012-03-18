(function() {

  window.Main = new Class({
    initialize: function() {
      this.drawer = new Drawer();
      this.events = new EventHandler();
      this.events.addEvent('change', this.drawer.updateData.bind(this.drawer));
      this.events.addEvent('viewport_change', this.drawer.positionateCanvas.bind(this.drawer));
      return this;
    },
    pause: function() {
      return this.drawer.pause();
    },
    unpause: function() {
      return this.drawer.unpause();
    }
  });

  document.addEvent('domready', function() {
    return window.app = new Main();
  });

}).call(this);
