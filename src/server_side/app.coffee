require( 'mootools' )

config  = require( '../configuration' ).configuration
server  = new ( require( './Server.js' ).Server )( config )
handler = new ( require( './Handler.js' ).Handler )( config )

server.addEvent 'join', handler.addPlayer.bind( handler )
server.addEvent 'message', handler.gotMessage.bind( handler )
server.addEvent 'quit', handler.removePlayer.bind( handler )
handler.addEvent 'change', server.sendJson.bind( server )
handler.addEvent 'full', server.reject.bind( server )

