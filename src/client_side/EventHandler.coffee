window.EventHandler = new Class {
  Implements: Events,

  initialize: ->
    WebSock = if typeof MozWebSocket != 'undefined' then MozWebSocket else WebSocket

    @sock = new WebSock 'ws://' + configuration.host + ':' + configuration.port, 'square-play'
    window.addEvent 'keydown', @keyDowned.bind(@)
    window.addEvent 'resize', @windowResized.bind(@)

    @sock.onopen    = @connected.bind(@)
    @sock.onmessage = @gotMessage.bind(@)
    @sock.onerror   = @error.bind(@)
    @


  # Events


  keyDowned: ( event ) ->
    if [ 'up', 'right', 'down', 'left' ].indexOf( event.key ) isnt -1
      event.preventDefault()

      data =
        id: this.id
        action: 'change_direction'
        params:
          direction: event.key
          run:       event.shift
          draw:      event.control

      @sock.send JSON.encode( data )


  connected: ->
    console.log( 'socket open' )
    @sock.send JSON.encode( action: 'init' )

  
  gotMessage: ( event ) ->
    data = JSON.decode event.data

    if data.id
      @id = data.id

    else
      @fireEvent 'change', [ data ]


  error: ->
    alert 'got error'


  windowResized: ->
    @fireEvent 'viewport_change'
}

