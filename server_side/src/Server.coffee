crypto = require( 'crypto' )

exports.Server = new Class {
  Implements: Events

  initialize: ->
    @http              = require( 'http' )
    @WebsocketServer   = require( 'websocket' ).server
    @connections       = {}

    @createHttpServer()
    @createWebsocketServer()
    @


  createHttpServer: ->
    @http_server = @http.createServer ( req, resp ) ->
      console.log 'received request for : '  + req.url
      resp.writeHead 404
      resp.end()

    @http_server.listen 3000, ->
      console.log 'starting server'


  createWebsocketServer: ->
    @wsServer = new this.WebsocketServer {
      httpServer:             @http_server
      autoAcceptConnections:  false
    }

    @wsServer.on 'request', @requested.bind( this )


  originIsAllowed: ( origin ) ->
    origin.match new RegExp( configuration.host )


  reject: ( id ) ->
    @connections[ id ].end( 'no more room' )
    delete @connections[ id ]


  sendJson: ( message ) ->
    Object.each @connections, ( connection ) ->
      connection.sendUTF JSON.stringify( message )


  # Events


  requested: ( request ) ->
    if ! @originIsAllowed( request.origin )
      request.reject()
      console.log ( new Date() ) + ' Connection from origin ' + request.origin + ' rejected.'

    else
      id = crypto.createHash( 'sha1' ).update( String.uniqueID() ).digest( 'hex' )
      connection = request.accept 'square-play', request.origin
      @connections[ id ] = connection
      connection.sendUTF JSON.stringify({ id: id })
      console.log ( new Date() ) + ' Connection accepted.'
    
      @handleMessage connection, id
      @handleClose connection, id
      
      @fireEvent 'join', id


  handleMessage: ( connection, id ) ->
    connection.on 'message', ( message ) =>
      if message.type is 'utf8'
        @fireEvent 'message', [ JSON.parse( message.utf8Data ) ]


  handleClose: ( connection, id ) ->
    connection.on 'close', ( reasonCode, description ) =>
      console.log ( new Date() ) + ' Peer ' + connection.remoteAddress + ' disconnected.'
      delete @connections[ id ]
      @fireEvent 'quit', id
}

