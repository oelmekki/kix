var crypto = require( 'crypto' );

exports.Server = new Class({ 
  Implements: Events,

  initialize: function( config ){
    this.http              = require( 'http' );
    this.WebsocketServer   = require( 'websocket' ).server;
    this.connections       = {};
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
    Object.each( this.connections, function( connection ){
      connection.sendUTF( JSON.stringify( message ) );
    });
  },


  // Events


  requested: function( request ){
    var connection, id;

    if ( ! this.originIsAllowed( request.origin ) ){
      request.reject();
      console.log( ( new Date() ) + ' Connection from origin ' + request.origin + ' rejected.' );
    }

    else {
      id = crypto.createHash( 'sha1' ).update( String.uniqueID() ).digest( 'hex' );
      connection = request.accept( 'square-play', request.origin );
      this.connections[ id ] = connection;
      connection.sendUTF( JSON.stringify({ id: id }) );
      console.log(( new Date() ) + ' Connection accepted.' );
    
      this.handleMessage( connection, id );
      this.handleClose( connection, id );
      
      this.fireEvent( 'join', id );
    }
  },


  handleMessage: function( connection, id ){
    connection.on( 'message', function( message ){
      if ( message.type === 'utf8' ){
        this.fireEvent( 'message', [ JSON.parse( message.utf8Data ) ] );
      }
    }.bind( this ));
  },


  handleClose: function( connection, id ){
    connection.on( 'close', function( reasonCode, description ){
      console.log(( new Date() ) + ' Peer ' + connection.remoteAddress + ' disconnected.' );
      delete this.connections[ id ];
      this.fireEvent( 'quit', id );
    }.bind( this ));
  }
});
