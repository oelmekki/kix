var Main = new Class({ 

  initialize: function(){
    this.drawer = new Drawer();
    this.events = new EventHandler();

    this.events.addEvent( 'change', this.drawer.update.bind( this.drawer ) );
    this.events.addEvent( 'viewport_change', this.drawer.positionateCanvas.bind( this.drawer ) );
  }
});

document.addEvent( 'domready', function(){
  window.app = new Main();
});
