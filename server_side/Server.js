exports.Server = new Class({ 
  Implements: Events,

  initialize: function( config ){
    this.http              = require( 'http' );
    this.WebsocketServer   = require( 'websocket' ).server;
    this.connections       = [];
    this.config            = config;

    this.createHttpServer();
    this.createWebsocketServer();
  },


  createHttpServer: function(){
    this.http_server = this.http.createServer( function( req, resp ){
      console.log( 'received request for : '  + req.url );
      resp.writeHead( 404 );
      resp.end();
    });

    this.http_server.listen( 3000, function(){
      console.log( 'starting server' );
    });
  },


  createWebsocketServer: function(){
    this.wsServer = new this.WebsocketServer({ 
      httpServer:             this.http_server,
      autoAcceptConnections:  false
    });

    this.wsServer.on( 'request', this.requested.bind( this ) );
  },


  originIsAllowed: function( origin ){
    return origin.match( new RegExp( this.config.host ) );
  },


  sendJson: function( message ){
    this.connections.each( function( connection ){
      connection.sendUTF( JSON.stringify( message ) );
    });
  },


  // Events


  requested: function( request ){
    var connection;

    if ( ! this.originIsAllowed( request.origin ) ){
      request.reject();
      console.log( ( new Date() ) + ' Connection from origin ' + request.origin + ' rejected.' );
    }

    else {
      connection = request.accept( 'square-play', request.origin );
      this.connections.push( connection );
      console.log(( new Date() ) + ' Connection accepted.' );
    }

    this.handleMessage( connection );

  },


  handleMessage: function( connection ){
    connection.on( 'message', function( message ){
      if ( message.type === 'utf8' ){
        this.fireEvent( 'message', [ JSON.parse( message.utf8Data ) ] );
      }
    }.bind( this ));
  },


  handleClose: function( connection ){
    connection.on( 'close', function( reasonCode, description ){
      var i;

      console.log(( new Date() ) + ' Peer ' + connection.remoteAddress + ' disconnected.' );
      i = this.connections.indexOf( connection );
      delete this.connections[ i ];
    }.bind( this ));
  }
});
