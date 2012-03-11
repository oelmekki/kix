var Main = new Class({ 

  initialize: function(){
    this.drawer = new Drawer();
    this.events = new EventHandler();

    this.events.addEvent( 'change', this.drawer.updateData.bind( this.drawer ) );
    this.events.addEvent( 'viewport_change', this.drawer.positionateCanvas.bind( this.drawer ) );
  },


  pause: function(){
    this.drawer.pause();
  },


  unpause: function(){
    this.drawer.unpause();
  }
});

document.addEvent( 'domready', function(){
  window.app = new Main();
});
