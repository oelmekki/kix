var EventHandler = new Class({ 
  Implements: Events,

  initialize: function(){
    var WebSock = typeof MozWebSocket != 'undefined' ? MozWebSocket : WebSocket;

    this.sock = new WebSock( 'ws://' + configuration.host + ':' + configuration.port, 'square-play' );
    window.addEvent( 'keydown', this.keyDowned.bind( this ) );
    window.addEvent( 'resize', this.windowResized.bind( this ) );

    this.sock.onopen    = this.connected.bind( this );
    this.sock.onmessage = this.gotMessage.bind( this );
    this.sock.onerror   = this.error.bind( this );
  },


  // Events


  keyDowned: function( event ){
    var data;

    if ( [ 'up', 'right', 'down', 'left' ].indexOf( event.key ) !== -1 ){
      event.preventDefault();

      data = {
        id: this.id,
        action: 'move',
        params: {
          direction: event.key,
          step: event.shift ? 5 : 1
        }
      };

      this.sock.send( JSON.encode( data ) );
    }
  },


  connected: function(){
    console.log( 'socket open' );
    this.sock.send( JSON.encode({ action: 'init' }) );
  },

  
  gotMessage: function( event ){
    var data = JSON.decode( event.data );

    if ( data.id ){
      this.id = data.id;
    }

    else {
      this.fireEvent( 'change', [ data ] );
    }
  },


  error: function(){
    alert( 'got error' );
  },


  windowResized: function(){
    this.fireEvent( 'viewport_change' );
  }
});
