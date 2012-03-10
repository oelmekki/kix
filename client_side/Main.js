var Main = new Class({ 

  initialize: function(){
    this.drawer = new Drawer();
    this.events = new EventHandler();

    this.events.addEvent( 'change', this.drawer.change.bind( this.drawer ) );
  }
});

document.addEvent( 'domready', function(){
  window.app = new Main();
});
