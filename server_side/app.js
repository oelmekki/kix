require( 'mootools' );

var config  = require( '../configuration' ).configuration;
var server  = new ( require( './Server.js' ).Server )( config );
var handler = new ( require( './Handler.js' ).Handler )( config );

server.addEvent( 'join', handler.addPlayer.bind( handler ) );
server.addEvent( 'message', handler.gotMessage.bind( handler ) );
server.addEvent( 'quit', handler.removePlayer.bind( handler ) );
handler.addEvent( 'change', server.sendJson.bind( server ) );
