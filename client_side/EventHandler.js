var EventHandler = new Class({ 
  Implements: Events,

  initialize: function(){
    this.sock = new WebSocket( 'ws://' + configuration.host + ':' + configuration.port, 'square-play' );
    window.addEvent( 'keydown', this.keyDowned.bind( this ) );

    this.sock.onopen = function(){
      console.log( 'socket open' );
      this.sock.send( JSON.encode({ action: 'init' }) );
    }.bind( this );

    this.sock.onmessage = this.gotMessage.bind( this );

    this.sock.onerror = function(){
      alert( 'got error' );
    };
  },

  // Events

  keyDowned: function( event ){
    var data;

    if ( event.control ){
      if ( [ 'up', 'right', 'down', 'left' ].indexOf( event.key ) !== -1 ){
        event.preventDefault();

        data = {
          action: 'resize',
          params: {
            direction: event.key,
            step: event.shift ? 5 : 1
          }
        };

        this.sock.send( JSON.encode( data ) );
      }
    }
    
    else {
      if ( [ 'up', 'right', 'down', 'left' ].indexOf( event.key ) !== -1 ){
        event.preventDefault();

        data = {
          action: 'move',
          params: {
            direction: event.key,
            step: event.shift ? 5 : 1
          }
        };

        this.sock.send( JSON.encode( data ) );
      }
    }
  },

  
  gotMessage: function( event ){
    this.fireEvent( 'change', [ JSON.decode( event.data ) ] );
  }
});
